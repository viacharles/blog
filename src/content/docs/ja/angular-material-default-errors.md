---
title: Angular Material コンポーネントのデフォルト errors
description: Angular Material の組み込み validation error のメモ。
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
<em>気になったきっかけは、Angular Material の `mat-datepicker` にある `[matDatepickerFilter]` が自動で出す error でした。</em>
<br>
<br>
`matDatepickerFilter` は関数を受け取り、カレンダー内の各日付が選択可能かどうかを判定します。意外だったのは、control value が filter によって不正と判断されると、control に自動で次の error が付くことです。

`{ matDatepickerFilter: true }`

そこで AI に、Angular Material にはこのようなデフォルト error が他にもあるのか聞いてみました。
挙がってきたものの多くは date/time 系コンポーネントに関連していて、特に parse や format に関係するものが多いです。

dynamic form で error handling を共通化したい場合は、ここを把握しておく必要があります。

あわせて AI に test sample も作ってもらい、Angular 20 で確認しました。
<br>
<br>
試してみたい場合はこちら:
<a href="https://test-sample-bjk.pages.dev/tests/angular-material-default-errors-20260227" target="_blank" rel="noopener noreferrer">テストサンプル</a>
<br>
以下が整理した内容です。
<br>

## mat-datepicker のプロパティ

- [ **matDatepickerFilter** ]: control の値が filter で弾かれた場合に出ます。
```json
{ "matDatepickerFilter": true }
```
- [ **matDatepickerMin** ] / [ **matDatepickerMax** ]: control の値が `min` より小さい、または `max` より大きい場合に出ます。
```json
{
    "matDatepickerMin": {
      "min": "2026-02-09T16:00:00.000Z", // min
      "actual": "2026-01-31T16:00:00.000Z" // control value
    },
     "matDatepickerMax": {
      "max": "2026-02-19T16:00:00.000Z", // max
      "actual": "2026-02-24T16:00:00.000Z" // control value
    }
}
```
- [ **matDatepickerParse** ]: 日付を手入力して format が壊れた場合に出ます。
```json
{
"matDatepickerParse": {
      "text": "not-a-date" // input に表示されている文字列。control value は null になる
    }
}
```
<br>

## mat-date-range のプロパティ

- [ **rangeStart** ] / [ **rangeEnd** ]: control value が有効範囲外の場合に出ます。
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

## mat-timepicker のプロパティ

- [ **matTimepickerMin** ] / [ **matTimepickerMax** ]: control の値が `min` より小さい、または `max` より大きい場合に出ます。
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
- [ **matTimepickerParse** ]: 時刻を手入力して format が壊れた場合に出ます。
```json
{
  "matTimepickerParse": {
      "text": "25:99"
    }
}
```
<br>
<br>

| Error Key | 由来 | 意味 |
| --- | --- | --- |
| matDatepickerFilter | datepicker | `filterFn` が `false` を返す |
| matDatepickerMin | datepicker | `min` より小さい |
| matDatepickerMax | datepicker | `max` より大きい |
| matDatepickerParse | datepicker | parse 失敗 |
| matStartDateInvalid | range | start parse 失敗 |
| matEndDateInvalid | range | end parse 失敗 |
| matTimepickerMin | timepicker | `min` より小さい |
| matTimepickerMax | timepicker | `max` より大きい |
| matTimepickerParse | timepicker | parse 失敗 |
