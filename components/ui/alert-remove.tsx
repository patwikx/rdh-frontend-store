import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconButton } from "@/components/ui/icon-button"; // Adjust the import path accordingly
import { Trash2 } from "lucide-react"; // Make sure to import the icon

export function AlertRemoveItem({ onRemove }: { onRemove: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <IconButton 
                    icon={<Trash2 size={15} color="red" />} // Your Trash2 icon
                    className="hover:bg-red-100" // Optional styling
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your item.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onRemove}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
