import { format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

export function formatDate(date: string): string {
	const parsedDate = new Date(date);
	return format(parsedDate, 'dd.MM.yyyy HH:mm', { locale: de });
}

export function formatApplicationDeadline(deadline: string): string {
	const now = new Date();
	const deadlineDate = new Date(deadline);

	const minutesDiff = differenceInMinutes(deadlineDate, now);
	const hoursDiff = differenceInHours(deadlineDate, now);
	const daysDiff = differenceInDays(deadlineDate, now);

	if (minutesDiff <= 0) {
		return 'Abgelaufen'; // Deadline has passed
	} else if (minutesDiff < 60) {
		return `in ${minutesDiff} Minuten`;
	} else if (hoursDiff < 24) {
		const remainingMinutes = minutesDiff % 60;
		return `in ${hoursDiff} Stunden und ${remainingMinutes} Minuten`;
	} else if (daysDiff <= 7) {
		const remainingHours = hoursDiff % 24;
		return `in ${daysDiff} Tagen und ${remainingHours} Stunden`;
	} else {
		return format(deadlineDate, 'dd.MM.yyyy HH:mm', { locale: de }); // Format date in German standard
	}
}

export function getInitials(name: string): string {
	const names = name.split(' ');
	if (names.length === 0) return '';
	const firstName = names[0].charAt(0).toUpperCase();
	const lastName = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
	return `${firstName}${lastName}`;
}

export function formatTextWithHTML(text: string): string {
	return text
		.replace(/\n/g, '<br>') // Zeilenumbrüche in <br>
		.replace(/\t•\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;• ') // Tabs mit Bulletpoints ersetzen
		.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}
