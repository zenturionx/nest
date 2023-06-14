export let name: string = 'sebastian';
export const age = 35;
export const isValid: boolean = true;

name = 'Melissa';

export const templateString = ` Esto es un string
multilinea
que puede tener
" dobles
' simples
inyectar valores como ${name}
y tambien expresiones ${1 + 1}
o numeros ${age}
o booleanos ${isValid}
`;

console.log(templateString);
