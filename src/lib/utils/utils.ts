export function formatEuro(amount: number, locale = 'de-DE'): string {
	return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);
}
