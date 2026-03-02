### Loyihani ishga tushurish:

```
node index.js
```

### Endpointlar:

| Endpoint    | Vazifasi                                                                                    | Method |
| ----------- | ------------------------------------------------------------------------------------------- | ------ |
| `/todo`     | barcha todolarni qaytaradi                                                                  | GET    |
| `/todo/:id` | id bo'yicha todo qaytaradi                                                                  | GET    |
| `/todo/:id` | id bo'yicha todoni o'chiradi                                                                | DELETE |
| `/todo/:id` | id bo'yicha _name_ va _description_ parametrlaridan yuborilgan yangi qiymatlarga yangilaydi | PATCH  |
| `/todo`     | _name_ va _description_ parametrlaridan yuborilgan qiymatlar asosida yangi todo yaratadi    | POST   |
