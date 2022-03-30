import { TransactionStatus } from "../models/transaction-status";

export interface BCAInterface {
    va_numbers: [
        {
            va_number: string,
            bank: string
        }
    ],
    transaction_time: string,
    transaction_status: TransactionStatus,
    transaction_id: string,
    status_message: string, 
    status_code: string,
    signature_key: string,
    permata_va_number: string,
    order_id: string,
    merchant_id: string,
    gross_amount: string,
    fraud_status: string,
    custom_field1: string,
    custom_field2: string,
    currency: string;
}