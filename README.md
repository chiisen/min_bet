# min_bet
依據每個遊戲 minBet 填入正確的 denom
![SQL語法](https://i.imgur.com/0lkyZWD.png)
- 有下面幾種狀態:
  - 正常
  - 預設為 1:1(denom沒有的話，也要新增1:1，再把預設值填1:1，例如:VA等等)

# 安裝
```bash=
npm ci
```
- 還要安裝 cli-color
```bash=
npm i cli-color
```

# 編譯成 JavaScript
```bash=
npm run build
```

# 執行方法
- 修改 .\input\匯率表.xlsx 裡面的匯率與幣別參數
- ⭐開啟 index.ts 再按下【執行與偵錯】，才能正常執行(目前還不知道原因，之後會修正)


# 輸出
alter_幣別.sql
minBet_幣別.xlsx

# 安裝本地套件
```bash=
npm install --save D:\github\chiisen\58-toolkit.js
```


