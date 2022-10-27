// converts from base 64 string to utf8 string
export const base64ToUTF8String = (base64String) => {
    return Buffer.from(base64String, 'base64').toString("utf-8")
}

// converts from utf8 string to base 64 string
export const utf8ToBase64String = (utf8String) => {
    return Buffer.from(utf8String, 'utf8').toString('base64')
}