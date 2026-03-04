---
title: template 屬性的特別 errors
description: Angular Material 預設 errors 筆記。
pubDate: 2026 March 02
tags:
  - Angular
  - Angular Material
  - Reactive form
translationKey: angular-material-default-errors
draft: false
order: 3
section: Angular Material
---


<br>
 <em> 引發我好奇的是遇到在 mat-datepicker 系統裡的屬性 [matDatepickerFilter] 自己丟出來的錯誤。 </em>
<br>
<br>
  matDatepickerFilter 的功能是傳入一個函式，透過函式判斷月曆裡每個日期是否可被選擇。沒想到control value 的值如果被濾掉(不合格)，control 會自動得到一個 
  
  { matDatepickerFilter: true }。



  於是問 ai material 還有沒有其他這種預設的 error，
列出的主要都是跟 date time 相關的元件，大部分跟日期的格式化有關，

這在做 dynamic form 統一處理錯誤的時候需要注意。

我請ai做一個test sample，
用 angular 20 測，
<br>
<br>
有興趣的可以進來試試看:
<a href="https://test-sample-bjk.pages.dev/tests/angular-material-default-errors-20260227" target="_blank" rel="noopener noreferrer">測試範例</a>
<br>
以下是整理資料：
<br>

## mat-datepicker 的屬性

- [ **matDatepickerFilter** ]，如果 control 的值被濾掉了，會出現這個錯誤。
```json
{ "matDatepickerFilter": true }
```
- [ **matDatepickerMin** ] / [ **matDatepickerMax** ]，如果 control 的值小於 min / 大於 max，會出現這個錯誤。
```json
{
    "matDatepickerMin": {
      "min": "2026-02-09T16:00:00.000Z", // min
      "actual": "2026-01-31T16:00:00.000Z" // control 值
    },
     "matDatepickerMax": {
      "max": "2026-02-19T16:00:00.000Z", // max
      "actual": "2026-02-24T16:00:00.000Z" // control 值
    }
}
```
 - [ **matDatepickerParse** ]，如果手改日期導致格式壞掉，會出驗這個錯誤。
```json
{
"matDatepickerParse": {
      "text": "not-a-date" // 目前input顯示字串，但 control value 會是 null 。
    }
}
```
<br>

## mat-date-range 的屬性
- [ **rangeStart** ] / [ **rangeEnd** ]，如果 control 值不在範圍內，會出現這個錯誤。
```json
{
"rangeStart": {
    "matStartDateInvalid": {
      "end": "2026-02-09T16:00:00.000Z",
      "actual": "2026-02-19T16:00:00.000Z"
    }
  },
  "rangeEnd": {
    "matEndDateInvalid": {
      "start": "2026-02-19T16:00:00.000Z",
      "actual": "2026-02-09T16:00:00.000Z"
    }
  },
}
```
## mat-timepicker 的屬性
- [ **matTimepickerMin** ] / [ **matTimepickerMax** ]，如果 control 的值小於 min / 大於 max，會出現這個錯誤。
```json
{
 "matTimepickerMax": {
      "max": "2026-02-15T10:00:00.000Z",
      "actual": "2026-02-15T11:30:00.000Z"
    }
 "matTimepickerMin": {
      "min": "2026-02-15T01:00:00.000Z",
      "actual": "2026-02-15T00:30:00.000Z"
    }
}
```
- [ **matTimepickerParse** ]如果手改日期導致格式壞掉，會出現這個錯誤。
```json
{
  "matTimepickerParse": {
      "text": "25:99"
    }
}
```
<br>
<br>


| Error Key | 來源 | 功能 |
| --- | --- | --- |
| matDatepickerFilter | datepicker | filterFn 回傳 false |
| matDatepickerMin | datepicker | 小於 min |
| matDatepickerMax | datepicker | 大於 max |
| matDatepickerParse | datepicker | parse 失敗 |
| matStartDateInvalid | range | start parse 失敗 |
| matEndDateInvalid | range | end parse 失敗 |
| matTimepickerMin | timepicker | 小於 min |
| matTimepickerMax | timepicker | 大於 max |
| matTimepickerParse | timepicker | parse 失敗 |
