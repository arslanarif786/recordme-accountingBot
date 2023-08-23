export const newInvoiceForm = {
    invoices: [
        {
            address: "",
            balanceDue: "",
            currencyCode: "",
            date: "",
            discount: "",
            dueDate: "",
            email: "",
            invoiceNumber: "",
            lineItems: [
                {
                    description: "",
                    disc: 0,
                    lineAmount: 0,
                    quantity: 0,
                    taxAmount: 0,
                    unitAmount: 0,
                    itemCode: "",
                    accountCode: "",
                    taxType: "",
                },
            ],
            name: "",
            subTotal: "",
            totalTax: "",
            total: "",
            status: "",
            type: "ACCREC",
            lineAmountTypes: "Exclusive",
        },
    ],
}