---
title: AngularMaterial屬性的預設errors
description: Angular Material 預設 errors 筆記。
pubDate: 2026-03-02
tags:
  - Angular
  - Angular Material
  - Reactive form
draft: false
order: 3
section: Angular Material
---

  我以為**「沒加 validator 就不會有 errors」**，結果今天發現 mat-datepicker 它自己會往 FormControl.errors 塞 matDatepickerFilter。

  最近遇到一個專案，
他的動態表單錯誤要統一用一個popup顯示全部提示，
方法是用 reactiveForm control的 error key(轉i18n) 和 field config(自訂) 的標題屬性組成提示字串。
但發現 mat-datepicker 會丟出我沒想到的 error。

  **原來 " material 元件有自己的預設的html屬性binding error "。**

就算 formControl 裡沒設定 validators，也沒綁 html5 input 限制屬性(require, min...ex)，
也會因為 material 自己預設的機制而讓 formControl 裡的 errors 裡有東西。

我遇到的是在 mat-datepicker 系統裡的屬性 [matDatepickerFilter] 自己丟出來的錯誤。

  matDatepickerFilter 的功能是傳入一個函式，透過函式判斷月曆裡每個日期是否可被選擇。沒想到control value 的值如果被濾掉(不合格)，control 會自動得到一個 { matDatepickerFilter: true }。

  於是問 ai material 還有沒有其他這種預設的 error，
列出的主要都是跟 date time 相關的元件，大部分跟日期的格式化有關，
我請ai做一個test sample，
用 angular 20 測，
有興趣的可以進來試試看:

[測試範例](https://test-sample-bjk.pages.dev/tests/angular-material-default-errors-20260227)

以下是整理資料：

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
