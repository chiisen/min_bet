# min_bet
依據每個遊戲 minBet 填入正確的 denom  
![SQL語法](https://i.imgur.com/0lkyZWD.png)
- 有下面幾種狀態:
  - 正常(依據 minBet denom 的設定檔案)
  - 預設為 1:1(denom沒有的話，也要新增1:1，再把預設值填1:1，例如:VA等等)
  - 只有DC，例如: FUNKY ，就是不做修改
  - PHP 1:1 指的是只有 PHP 幣別，而且 denom 只有 1:1，預設也是1:1
  - IDR、VND 1000:1 指的是只有 IDR、VND 幣別，而且 denom 只有 1000:1 

# .env
- denom預設是否1:1(true:預設1:1&&denom陣列也新增1:1,false:正常設定 ❌關閉功能,目前用【denom特化統整表.xlsx】來設定)
DEFAULT_DENOM_1BY1

- 讀表或自己算(true:自己算,false:讀表)
IS_CALCULATE

- 是否匯出所有HALL的幣別設定(true:以HALL為目錄匯出)
IS_ALL_DC_CURRENCIES

一般都是讀表來進行設定denom(此值為false)
因為設定內容沒有100%遵守公式
加入了很多的人為設定

除了要新增全新的幣別，改為true
可以幫你建立計算好的EXCEL與SQL腳本


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

# 移除本地安裝包的 58-toolkit 套件
```bash=
npm uninstall --save 58-toolkit
```

# 安裝 58-toolkit 套件
```bash=
npm install 58-toolkit
```

# 升級 58-toolkit 套件到最新版
```bash=
npm install 58-toolkit@latest
```

