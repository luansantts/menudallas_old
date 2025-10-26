const mockBanners = [
  {
    id: 1,
    arte: "/img/bannerExample1.png",
    link: "https://menudallas.com",
  },
  {
    id: 2,
    arte: "/img/headerExampleStore.png",
    link: "https://menudallas.com",
  },
];

const mockCategories = [
  {
    id: 1,
    nome: "Lanches",
    icone: "/img/categoryExample.png",
  },
  {
    id: 2,
    nome: "Pizzas",
    icone: "/img/categoryExample.png",
  },
  {
    id: 3,
    nome: "Japonesa",
    icone: "/img/categoryExample.png",
  },
  {
    id: 4,
    nome: "Doces",
    icone: "/img/categoryExample.png",
  },
  {
    id: 5,
    nome: "Bebidas",
    icone: "/img/categoryExample.png",
  },
];

const mockStores = [
  {
    id: 101,
    nome: "Empresa Teste",
    nome_pagina: "empresa-teste",
    segmento: "Lanches",
    tempo_entrega: "35 - 45 min",
    distancia: 2.3,
    logo_home: "/img/exampleStoreLogo.png",
    hora_abre: "10:00",
    hora_fecha: "23:00",
    abre_segunda: true,
    abre_terca: true,
    abre_quarta: true,
    abre_quinta: true,
    abre_sexta: true,
    abre_sabado: true,
    abre_domingo: true,
    emPausa: false,
  },
  {
    id: 102,
    nome: "Dallas Pizzas",
    nome_pagina: "dallas-pizzas",
    segmento: "Pizzas",
    tempo_entrega: "45 - 60 min",
    distancia: 4.1,
    logo_home: "/img/exampleStoreLogo.png",
    hora_abre: "18:00",
    hora_fecha: "02:00",
    abre_segunda: true,
    abre_terca: true,
    abre_quarta: true,
    abre_quinta: true,
    abre_sexta: true,
    abre_sabado: true,
    abre_domingo: true,
    emPausa: false,
  },
  {
    id: 103,
    nome: "Sushi Dallas",
    nome_pagina: "sushi-dallas",
    segmento: "Japonesa",
    tempo_entrega: "50 - 65 min",
    distancia: 3.4,
    logo_home: "/img/exampleStoreLogo.png",
    hora_abre: "17:00",
    hora_fecha: "23:30",
    abre_segunda: false,
    abre_terca: true,
    abre_quarta: true,
    abre_quinta: true,
    abre_sexta: true,
    abre_sabado: true,
    abre_domingo: true,
    emPausa: false,
  },
];

export function resolveOfflineMock(pathname = "") {
  const cleanPath = pathname.split("?")[0];

  switch (cleanPath) {
    case "home/banner":
      return mockBanners;
    case "home/categoria":
      return mockCategories;
    case "home/segmento":
      return mockStores;
    default:
      return null;
  }
}
