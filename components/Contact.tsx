'use client'
import {useEffect, useState} from 'react'
import emailjs from '@emailjs/browser'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {Linkedin, LinkedinIcon, Mail, Send} from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link";

interface FormData {
    name: string
    email: string
    message: string
}

// EmailJS credentials
const EMAILJS_SERVICE_ID = "service_k4r7s72"
const EMAILJS_TEMPLATE_ID = "template_kv16az9"
const EMAILJS_PUBLIC_KEY = "6ClnBf-N1cgMsQhvc"

export default function ContactFormDialog() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [toastColor, setToastColor] = useState<string>('bg-green-500')


    useEffect(() => {
        let toastTimer: NodeJS.Timeout;

        if (toastMessage) {
            toastTimer = setTimeout(() => {
                setToastMessage(null);
            }, 15000); // 30 seconds
        }

        // Cleanup function
        return () => {
            if (toastTimer) {
                clearTimeout(toastTimer);
            }
        };
    }, [toastMessage]); // Default to success color

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_email: 'ndiyizeye123@gmail.com, patrickndizeye02@gmail.com'
            }

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            )

            // Success message
            setToastMessage('Message sent successfully!')
            setToastColor('bg-green-500')
            setIsOpen(false)
            setFormData({name: '', email: '', message: ''})
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error sending email:', error.message || 'No error message available')
            } else if (typeof error === 'object' && error !== null) {
                console.error('Error sending email:', JSON.stringify(error))
            } else {
                console.error('Error sending email:', String(error) || 'Unknown error')
            }
            setToastMessage('Error sending message. Please try again.')
            setToastColor('bg-red-500')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <>
            <Link href="https://www.linkedin.com/in/ndizeye-patrick-76718222a/" rel="noopener noreferreer ">
                {<LinkedinIcon className="h-4 m-3"/>}
            </Link>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Us
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-blue-900/90 border border-blue-500/20 backdrop-blur-sm">
                    <DialogHeader>
                        <DialogTitle className="text-blue-100">Get in Touch</DialogTitle>
                        <DialogDescription className="text-blue-300">
                            Want to work with us Or give us your advice here ?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-blue-200">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="bg-blue-950/50 border-blue-500/20 text-white placeholder:text-blue-300"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-blue-200">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="bg-blue-950/50 border-blue-500/20 text-white placeholder:text-blue-300"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-blue-200">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="What would you like to tell us?"
                                className="bg-blue-950/50 border-blue-500/20 text-white placeholder:text-blue-300 min-h-[100px]"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Toast Notification */}
            {toastMessage && (
                <div
                    className={`${toastColor} fixed top-[10%] left-[82%]  text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300`}
                >
                    {toastMessage}
                </div>
            )}
            <Toaster />
        </>
    )
}
