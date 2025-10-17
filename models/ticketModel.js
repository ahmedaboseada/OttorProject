import mongoose from "mongoose";

export const servicesEnum = {
    OutsourcedAccountingBookkeeping: 'Outsourced Accounting & Bookkeeping',
    UAEVATServices: 'UAE VAT Services',
    CorporateTaxAdvisory: 'Corporate Tax Advisory',
    AMLCFTCompliance: 'AML/CFT Compliance',
    FinancialStatementsPreparation: 'Financial Statements Preparation',
    BusinessValuation: 'Business Valuation',
    TaxAdvisory: 'Tax Advisory'
}
export const statusEnum = {
    Pending: 'Pending',
    InProgress: 'In Progress',
    Completed: 'Completed',
    Cancelled: 'Cancelled'
}
const ticketSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    companyname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true,
        enum: Object.values(servicesEnum)
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(statusEnum),
        default: statusEnum.Pending
    }
},
{
    timestamps: true
});

export default mongoose.model("Ticket", ticketSchema);
