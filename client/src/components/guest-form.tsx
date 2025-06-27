import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { insertGuestSchema, type Guest, type InsertGuest } from "@shared/schema";
import { saveGuest, updateGuest } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface GuestFormProps {
  guest?: Guest | null;
  onSuccess?: () => void;
}

export default function GuestForm({ guest, onSuccess }: GuestFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertGuest>({
    resolver: zodResolver(insertGuestSchema),
    defaultValues: {
      name: guest?.name || "",
      email: guest?.email || "",
      phone: guest?.phone || "",
      address: guest?.address || "",
      rsvpStatus: guest?.rsvpStatus || "pending",
      plusOne: guest?.plusOne || false,
      dietaryRestrictions: guest?.dietaryRestrictions || "",
      notes: guest?.notes || "",
    },
  });

  const handleSubmit = async (data: InsertGuest) => {
    try {
      if (guest) {
        const result = updateGuest(guest.id, data);
        if (result) {
          toast({
            title: "Success",
            description: "Guest updated successfully",
          });
          onSuccess?.();
        } else {
          throw new Error("Failed to update guest");
        }
      } else {
        saveGuest(data);
        toast({
          title: "Success",
          description: "Guest added successfully",
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${guest ? "update" : "save"} guest`,
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-96">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter guest's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="guest@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rsvpStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RSVP Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plusOne"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Plus One</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Restrictions</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vegetarian, Gluten-free, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional notes about this guest" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            className="bg-pastel-green-400 hover:bg-pastel-green-500 text-white"
          >
            {guest ? "Update Guest" : "Add Guest"}
          </Button>
        </div>
      </form>
    </Form>
    </ScrollArea>
  );
}