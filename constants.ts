
import type { Category } from './types';

let idCounter = 1;

const createItem = (name: string, quantity: number, price: number) => ({
    id: idCounter++,
    name,
    quantity,
    price,
});

export const INITIAL_CATEGORIES: Category[] = [
    {
        id: 1,
        name: "Grãos e Derivados",
        items: [
            createItem("Arroz", 1, 0),
            createItem("Pão", 1, 5.99),
            createItem("Pãozinho", 1, 6.99),
            createItem("Feijão", 1, 0),
            createItem("Leite de coco", 1, 2.99),
            createItem("Açúcar", 1, 4.49),
            createItem("Sucos", 1, 15.40),
            createItem("Macarrão", 1, 5.28),
            createItem("Farinha de mesa", 1, 4.99),
            createItem("Farinha de Trigo", 2, 4.59),
            createItem("Queijo ralado", 4, 3.89),
            createItem("Molho de tomate", 4, 2.99),
            createItem("Azeite", 1, 23.75),
            createItem("Azeitona", 2, 5.59),
            createItem("Óleo de soja", 1, 6.39),
            createItem("Ketchup", 1, 14.90),
            createItem("Mostarda", 1, 21.98),
            createItem("Maionese", 1, 14.90),
            createItem("Milho Verde (Lata)", 1, 2.98),
            createItem("Ervilha (Lata)", 1, 2.79),
            createItem("Leite em Pó", 3, 12.87),
            createItem("Creme de Leite", 4, 2.49),
            createItem("Gelatina", 4, 0),
            createItem("Leite Condensado", 2, 0),
            createItem("Leite zero lactose", 4, 6.99),
            createItem("Adoçante em pó", 1, 16.50),
            createItem("Adoçante", 2, 0),
            createItem("Café", 2, 29.90),
            createItem("Biscoito Salgado", 2, 3.99),
            createItem("Biscoito Doce", 1, 2.99),
            createItem("Flocão de milho", 1, 0),
            createItem("Feijão vermelho", 1, 6.75),
            createItem("Feijão fradinho", 1, 4.25),
            createItem("Farinha de kibe", 1, 4.69),
            createItem("Ervilha seca", 1, 5.79),
            createItem("Feijão mulatinho", 1, 5.49),
            createItem("Farinha panko", 1, 25.28),
            createItem("Sal", 1, 0),
            createItem("Tempero de pipoca", 1, 5.09),
            createItem("Fermento em pó", 3, 0),
            createItem("Vinagre de álcool", 1, 2.39),
            createItem("Vinagre de maçã", 1, 5.09),
            createItem("Pipoca", 2, 3.29),
            createItem("Tapioca (Kg)", 1, 0),
            createItem("Polvilho azedo (Gr)", 1, 0),
            createItem("Pão integral (unidade)", 1, 0)
        ]
    },
    {
        id: 2,
        name: "Limpeza",
        items: [
            createItem("Detergente", 4, 2.29),
            createItem("Sabão Líquido (5l)", 1, 39.98),
            createItem("Amaciante", 2, 9.98),
            createItem("Absorvente", 1, 9.14),
            createItem("Água sanitária", 1, 0),
            createItem("Inseticida", 1, 13.90),
            createItem("Saco para freezer", 1, 0),
            createItem("Shampoo E condicionador", 1, 21.98),
            createItem("Papel manteiga", 1, 2.50),
            createItem("Lenço umedecido", 1, 7.99),
            createItem("Papel alumínio", 2, 3.49),
            createItem("Papel toalha", 1, 4.49),
            createItem("Guardanapo", 1, 5.69),
            createItem("Perfex", 1, 10.50),
            createItem("Papel higiênico", 1, 0),
            createItem("Pasta de dente", 2, 2.39),
            createItem("Esponja pra pia", 1, 12.25),
            createItem("Pedra sanitária", 2, 4.77),
            createItem("Enxaguante bucal", 1, 19.90),
            createItem("Desodorante André", 4, 8.99),
            createItem("Desodorante", 1, 13.98),
            createItem("Sabonete líquido", 1, 19.99),
            createItem("Sabonete", 4, 1.99),
            createItem("Sabonete phebo", 4, 3.77),
            createItem("Coala", 2, 9.98),
            createItem("Veja", 1, 3.99),
            createItem("Bom ar do banheiro", 1, 0)
        ]
    },
    {
        id: 3,
        name: "Carnes",
        items: [
            createItem("Filé de sobrecoxa", 2, 0),
            createItem("Contra file", 1, 0),
            createItem("Peito de Frango (Kg)", 2, 0),
            createItem("Carne Moída (Kg)", 1, 0),
            createItem("Peixe", 1, 0),
            createItem("Linguiça calabresa (Kg)", 1, 0),
            createItem("Linguiça paio", 1, 0),
            createItem("Carne seca", 1, 0),
            createItem("Costela suína (Kg)", 1, 0),
            createItem("Galeto", 1, 0),
            createItem("Copa lombo", 1, 0),
            createItem("Fraldinha suína", 1, 0)
        ]
    },
    {
        id: 4,
        name: "Ovos",
        items: [
            createItem("Ovos (Dúzia)", 1, 0)
        ]
    },
    {
        id: 5,
        name: "Laticínios",
        items: [
            createItem("Queijo mussarela (Kg)", 1, 0),
            createItem("Presunto", 1, 0),
            createItem("Iogurte", 1, 0),
            createItem("Margarina", 1, 18.26)
        ]
    },
    {
        id: 6,
        name: "Verduras e Legumes",
        items: [
            createItem("Alface (Unidade)", 1, 0),
            createItem("Tomate (Kg)", 1, 0),
            createItem("Cenoura (Kg)", 1, 0),
            createItem("Cebola (Kg)", 1, 0),
            createItem("Batata (Kg)", 1, 0)
        ]
    },
    {
        id: 7,
        name: "Frutas",
        items: [
            createItem("Banana (Kg)", 1, 0),
            createItem("Maçã (Kg)", 1, 0),
            createItem("Laranja (Kg)", 1, 0),
            createItem("Mamão (Kg)", 1, 0),
            createItem("Abacaxi (Unidade)", 1, 0)
        ]
    }
];
