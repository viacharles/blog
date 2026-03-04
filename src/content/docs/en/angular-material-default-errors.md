---
title: Default Errors in Angular Material Components
description: Notes on built-in Angular Material validation errors.
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
<em>What made me curious was the error emitted by the `[matDatepickerFilter]` input in Angular Material's `mat-datepicker`.</em>
<br>
<br>
`matDatepickerFilter` accepts a function and uses it to decide whether each date in the calendar can be selected. What surprised me is that if the control value is filtered out as invalid, the control automatically receives:

`{ matDatepickerFilter: true }`

I then asked AI whether Angular Material has other built-in errors like this.
Most of the listed cases are related to date/time components, and many of them are tied to parsing or formatting.

This matters when you want to centralize error handling in a dynamic form.

I also asked AI to build a test sample and verified it with Angular 20.
<br>
<br>
If you want to try it yourself:
<a href="https://test-sample-bjk.pages.dev/tests/angular-material-default-errors-20260227" target="_blank" rel="noopener noreferrer">Test sample</a>
<br>
Here is the整理 result:
<br>

## mat-datepicker properties

- [ **matDatepickerFilter** ] appears when the control value is filtered out.
```json
{ "matDatepickerFilter": true }
```
- [ **matDatepickerMin** ] / [ **matDatepickerMax** ] appear when the control value is smaller than `min` or greater than `max`.
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
- [ **matDatepickerParse** ] appears when manually editing the date breaks the format.
```json
{
"matDatepickerParse": {
      "text": "not-a-date" // current input string, while control value becomes null
    }
}
```
<br>

## mat-date-range properties

- [ **rangeStart** ] / [ **rangeEnd** ] appear when the control value is outside the valid range.
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

## mat-timepicker properties

- [ **matTimepickerMin** ] / [ **matTimepickerMax** ] appear when the control value is smaller than `min` or greater than `max`.
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
- [ **matTimepickerParse** ] appears when manually editing the time breaks the format.
```json
{
  "matTimepickerParse": {
      "text": "25:99"
    }
}
```
<br>
<br>

| Error Key | Source | Meaning |
| --- | --- | --- |
| matDatepickerFilter | datepicker | `filterFn` returns `false` |
| matDatepickerMin | datepicker | Smaller than `min` |
| matDatepickerMax | datepicker | Greater than `max` |
| matDatepickerParse | datepicker | Parse failed |
| matStartDateInvalid | range | Start parse failed |
| matEndDateInvalid | range | End parse failed |
| matTimepickerMin | timepicker | Smaller than `min` |
| matTimepickerMax | timepicker | Greater than `max` |
| matTimepickerParse | timepicker | Parse failed |
