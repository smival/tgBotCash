interface IAccount
{
    user_id: number;
    acc_name: string;
    date: Date;
    start: number;
    current: number;
}

interface ITransaction
{
    user_id: number;
    acc_name: string;
    date: Date;
    transaction_id: number;
    value: number;
}