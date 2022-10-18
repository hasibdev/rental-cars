export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const past21years = () => {
  return new Date((new Date()).getFullYear() - 21, (new Date()).getMonth(), (new Date()).getDate())
}

export const deCurrency = (num) => {
  if (isNaN(Number(num))) return
  return Number(num).toLocaleString('de-DE', {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "EUR"
  })
}

export const deToen = (num) => {
  if (num == null) return
  num = num.toString().replace(/[^\d.,]/g, '')
  num = num.replace(".", "").replace(",", ".")

  return Number(num)
}

export const localeNumber = (value = 0, lang = 'en') => {

  value = value.toString().replace(/[^\d.,]/g, '')

  // Check number for DE
  if (isNaN(value) && /[0-9]{1,3}(?:.[0-9]{3})*(?:,[0-9]+)/.test(value)) {
    value = (value).replace('.', '').replace(',', '.')
    if (lang == 'de') {
      value = Number(value).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    else {
      value = Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
  // Number is English
  else {
    if (lang == 'de') {
      const num = Number(value).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      value = num
    }
    else {
      const num = Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      value = num
    }
  }
  return value
}
