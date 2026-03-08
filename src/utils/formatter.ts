export const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

export const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

export const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
});


const formatter = {
    currency: (val: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),

    fullDate: (date: Date | string | number) =>
        fullDateFormatter.format(new Date(date)),

    time: (date: Date | string | number) =>
        timeFormatter.format(new Date(date)),

    date: (date: Date | string | number) =>
        dateFormatter.format(new Date(date))
};

export default formatter;