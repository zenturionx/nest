import {BadRequestException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {Product} from "./entities/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationDto} from "../common/dtos/pagination.dto";

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //TODO: paginar los resultados
  findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    return this.productRepository.find({
        take: limit,
        skip: offset,
      //TODO: relaciones
    });
  }

  findOne(id: string) {
    return this.productRepository.findOneBy({id});
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
