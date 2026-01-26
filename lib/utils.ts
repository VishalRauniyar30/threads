import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData)
}

export function formateDateString(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    }
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString(undefined, options)

    const time = date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
    })

    return `${time} - ${formattedDate}`
}

export function formatThreadCount(count: number): string {
    if(count === 0){
        return "No Threads"
    } else {
        const threadCount = count.toString().padStart(2, '0')
        const threadWord = count === 1 ? "Thread" : "Threads"
        return `${threadCount} ${threadWord}`
    }
}

export function timeAgo(date: string | Date) {
    const now = new Date()
    const past = new Date(date)
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`

    return past.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
    })
}
