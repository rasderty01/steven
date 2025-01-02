import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SupplierWithServices } from "@/lib/schemas/supplier";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form data type
export type ServiceSelectionFormData = {
  supplierId: number;
  supplierServiceId: number;
  startTime: string;
  endTime: string;
  agreedRate: number;
  notes?: string;
};

// Props type
export type ServiceSelectionFormProps = {
  supplier: SupplierWithServices;
  onSubmit: (data: ServiceSelectionFormData) => void;
};

// Form validation schema
const formSchema = z.object({
  supplierServiceId: z.number({
    required_error: "Please select a service",
  }),
  startTime: z
    .string({
      required_error: "Please select a start time",
    })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z
    .string({
      required_error: "Please select an end time",
    })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  agreedRate: z
    .number({
      required_error: "Please enter the agreed rate",
    })
    .min(0, "Rate must be a positive number"),
  notes: z.string().optional(),
});

export function ServiceSelectionForm({
  supplier,
  onSubmit,
}: ServiceSelectionFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierServiceId: supplier.SupplierService[0]?.id,
      startTime: "",
      endTime: "",
      agreedRate: 0,
      notes: "",
    },
  });

  // When service is selected, update the agreed rate to the base rate
  const handleServiceChange = (serviceId: string) => {
    const service = supplier.SupplierService.find(
      (s) => s.id === parseInt(serviceId)
    );
    if (service) {
      form.setValue("agreedRate", service.baseRate);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedDate) return;

    // Combine date with time inputs to create proper timestamps
    const startDateTime = new Date(selectedDate);
    const [startHours, startMinutes] = values.startTime.split(":");
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endDateTime = new Date(selectedDate);
    const [endHours, endMinutes] = values.endTime.split(":");
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    onSubmit({
      supplierId: supplier.id,
      supplierServiceId: values.supplierServiceId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      agreedRate: values.agreedRate,
      notes: values.notes,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Service Selection */}
        <FormField
          control={form.control}
          name="supplierServiceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                  handleServiceChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supplier.SupplierService.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} - ${service.baseRate} ({service.rateType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Agreed Rate */}
        <FormField
          control={form.control}
          name="agreedRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agreed Rate ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any special requirements or notes..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">Add Supplier</Button>
        </div>
      </form>
    </Form>
  );
}
