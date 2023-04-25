
config/default.json:
```
{
    "token": "your telegram token from BotFather",
    "mongoURL": "mongo cluster connsction URL like this: 
        mongodb+srv://user:passrord@clusterX..."
}
```
## commands:
/add
запрос названия счета string[10]
запрос начального баланса Number
add new record to 'users'
/plus
запрос выбор из списка аккаунтов
запрос суммы Number
/minus
запрос выбор из списка аккаунтов
запрос суммы Number
/list
вывод списка [название счета: баланс]
/kill
запрос выбор из списка аккаунтов


free input: +/-, Number, account_name


## example

/add
123, 20.03.1986, "usd", 1000, 1000
/plus
123, 20.03.1986,


## mongoDB Schema
-- accounts
user_id: number
acc_name: string
date: Date

start: number
current: number

--transactions
user_id: number
acc_name: string
date: Date

transaction_id: number (increment)
value: number

## mongoDB requests
