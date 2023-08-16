import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {validate as isUUID} from 'uuid';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product, ProductImage} from "./entities";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {PaginationDto} from "../common/dtos/pagination.dto";

@Injectable()
export class ProductsService {

    private readonly logger = new Logger('ProductsService');

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
        private readonly dataSource: DataSource,
    ) {
    }

    async create(createProductDto: CreateProductDto) {
        try {
            const { images = [], ...productDetails } = createProductDto;

            const product = this.productRepository.create({
                ...productDetails,
                images: images.map(image => this.productImageRepository.create({ url: image })),
            });
            await this.productRepository.save(product);
            return {...product, images};
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const {limit = 10, offset = 0} = paginationDto;
        const products = await this.productRepository.find({
            take: limit,
            skip: offset,
            relations: {
                images: true
            }
        });

        return products.map(product => ({
            ...product,
            images: product.images.map(image => image.url)
        }));
    }

    async findOne(term: string) {
        let product: Product;

        if (isUUID(term)) {
            product = await this.productRepository.findOneBy({id: term});
        } else {
            const queryBuilder = this.productRepository.createQueryBuilder('Product');
            product = await queryBuilder
                .where(' UPPER(title)=:title or slug=:slug', {
                    title: term.toUpperCase(),
                    slug: term.toLowerCase()
                })
                .leftJoinAndSelect('Product.images', 'images')
                .getOne();
        }

        if (!product) {
            throw new NotFoundException(`Product #${term} not found`);
        }
        return product;
    }

    async findOnePlain(term: string) {
        const { images = [], ...rest } = await this.findOne(term);
        return {
            ...rest,
            images: images.map(image => image.url)
        }
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto
    ) {
        const { images, ...toUpdate } = updateProductDto;
        const product = await this.productRepository.preload({id,...toUpdate});

        if (!product) {
            throw new NotFoundException(`Product #${id} not found`);
        }

        // create query runner
        const queryRunner = this.dataSource.createQueryRunner();


        try {
          await this.productRepository.save(product);
          return product;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async remove(id: string) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error creating product');
    }
}
