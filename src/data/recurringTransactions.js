export const recurringTransactions = [
    // Income
    {
        name: "Intereses",
        namePag: "Income",
        category_id: 10,
        description_id: 78,
        kind_id: 2,
        destiny_id: 8,
        activity_one: {
        nature: 1,
        account_id: 11,
        },
        activity_two: {
        nature: 0,
        account_id: 42,
        }
    },
    {
        name: "Salario",
        namePag: "Income",
        category_id: 1,
        description_id: 42,
        kind_id: 1,
        destiny_id: 8,
        activity_one: {
        nature: 1,
        account_id: 11,
        },
        activity_two: {
        nature: 0,
        account_id: 41,
        }
    },
    // Expenditure
    {
        name: "Almuerzo",
        namePag: "Expenditure",
        category_id: 3,
        description_id: 51,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 51,
        }
    },
    {
        name: "Gimnasio",
        namePag: "Expenditure",
        category_id: 13,
        description_id: 69,
        origin_id: 7,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Parqueadero",
        namePag: "Expenditure",
        category_id: 9,
        description_id: 75,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 51,
        }
    },
    {
        name: "Streaming",
        namePag: "Expenditure",
        category_id: 14,
        description_id: 71,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Gasolina",
        namePag: "Expenditure",
        category_id: 9,
        description_id: 61,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 51,
        }
    },
    {
        name: "Entretenimiento",
        namePag: "Expenditure",
        category_id: 14,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Regalo",
        namePag: "Expenditure",
        category_id: 19,
        origin_id: 2,
        activity_one: {
        nature: 0,
        account_id: 26,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Bicicleta",
        namePag: "Expenditure",
        category_id: 20,
        description_id: 67,
        origin_id: 5,
        activity_one: {
        nature: 0,
        account_id: 26,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Pago de deuda",
        namePag: "Expenditure",
        category_id: 16,
        description_id: 90,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Pago de deuda Seguro",
        namePag: "Expenditure",
        category_id: 16,
        description_id: 3,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 53,
        }
    },
    {
        name: "Celular",
        namePag: "Expenditure",
        category_id: 2,
        description_id: 44,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 51,
        }
    },
    // Cost
    {
        name: "Mercado",
        namePag: "Cost",
        category_id: 3,
        description_id: 49,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 71,
        }
    },
    {
        name: "Servicios publicos",
        namePag: "Cost",
        category_id: 2,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 71,
        }
    },
    {
        name: "Arriendo",
        namePag: "Cost",
        category_id: 12,
        description_id: 111,
        origin_id: 8,
        activity_one: {
        nature: 0,
        account_id: 11,
        },
        activity_two: {
        nature: 1,
        account_id: 71,
        }
    },
    // Transfer
    {
        name: "Prestamo",
        namePag: "Transfer",
        category_id: 4,
        kind_id: 2,
        destiny_id: 8,
        activity_one: {
        nature: 1,
        account_id: 11,
        },
        activity_two: {
        nature: 0,
        account_id: 13,
        }
    },
    {
        name: "Deuda",
        namePag: "Transfer",
        category_id: 4,
        description_id: 109,
        kind_id: 2,
        origin_id: 4,
        destiny_id: 25,
        activity_one: {
        nature: 1,
        account_id: 23,
        },
        activity_two: {
        nature: 0,
        account_id: 26,
        }
    },
    //Savings
    {
        name: "Fiducia Dav",
        namePag: "Savings",
        category_id: 28,
        description_id: 88,
        kind_id: 8,
        origin_id: 6,
        destiny_id: 12,
        activity_one: {
        nature: 1,
        account_id: 12,
        },
        activity_two: {
        nature: 0,
        account_id: 11,
        }
    },
  ];