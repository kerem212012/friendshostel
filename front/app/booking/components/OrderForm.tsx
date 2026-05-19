import {Card, CardBody, CardFooter} from "@heroui/card";
import {Input, Textarea} from "@heroui/input";
import {Button} from "@heroui/button";
import {useState} from "react";
import {BookingRequestPayload, BookingRequestPayloadWithUser} from "@/app/common/booking/types";
import {requestCreateBooking} from "@/app/common/booking/service";

interface OrderFormProps {
    host: string;
    payload: BookingRequestPayload;
    onClose: () => void;
    onSuccess: () => void;
}

export function OrderForm({host, payload, onClose, onSuccess}: OrderFormProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        emailConfirm: "",
        phone: "",
        address: "",
        comment: "",
    });

    const handleChange =
        (field: keyof typeof form) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm(prev => ({...prev, [field]: e.target.value}));
            };

    const isEmailMismatch =
        form.emailConfirm.length > 0 && form.email !== form.emailConfirm;

    const isValid =
        form.name &&
        form.email &&
        form.emailConfirm &&
        form.phone &&
        form.address &&
        !isEmailMismatch;

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const req: BookingRequestPayloadWithUser = {...payload, user: form}

            const result = await requestCreateBooking(host, req)
            onSuccess()
            alert("Success created order");
        } catch (error) {
            alert("Error while creating order");
            console.log(111, error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="relative transition-transform">
            <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-10 rounded-full p-2
                           hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close"
            >
                ✕
            </button>

            <CardBody className="p-6 space-y-6">
                <h1 className="text-xl font-semibold">Booking details</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange("name")}
                        isRequired
                    />

                    <Input
                        label="Phone"
                        placeholder="+1 234 567 89 00"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        isRequired
                    />

                    <Input
                        type="email"
                        label="Email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange("email")}
                        isRequired
                    />

                    <Input
                        type="email"
                        label="Confirm email"
                        placeholder="john@example.com"
                        value={form.emailConfirm}
                        onChange={handleChange("emailConfirm")}
                        isInvalid={isEmailMismatch}
                        errorMessage={isEmailMismatch ? "Emails do not match" : undefined}
                        isRequired
                    />
                </div>

                <Input
                    label="Address"
                    placeholder="Street, city, country"
                    value={form.address}
                    onChange={handleChange("address")}
                    isRequired
                />

                <Textarea
                    label="Comment"
                    placeholder="Any special requests or notes for your booking"
                    value={form.comment}
                    onChange={handleChange("comment")}
                    minRows={3}
                />
            </CardBody>

            <CardFooter className="flex justify-end gap-3">
                <Button variant="flat" onPress={onClose}>
                    Cancel
                </Button>

                <Button
                    color="primary"
                    isDisabled={!isValid || loading}
                    onPress={handleSubmit}
                    isLoading={loading}
                >
                    Confirm booking
                </Button>
            </CardFooter>
        </Card>
    );
}
