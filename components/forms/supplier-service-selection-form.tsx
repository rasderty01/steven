"use client";
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
import {
  ServiceSelectionFormData,
  supplierServiceSchema,
} from "@/lib/schemas/event-supplier.schema";

import { cn } from "@/lib/utils";
import { SupplierWithServices } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type ServiceSelectionFormProps = {
  supplier: SupplierWithServices;
  onSubmit: (data: ServiceSelectionFormData) => void;
};

export function ServiceSelectionForm({
  supplier,
  onSubmit,
}: ServiceSelectionFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { eventId } = useParams();

  // Get default service - we know services array is not empty
  const defaultService = supplier.services[0];

  const form = useForm<z.infer<typeof supplierServiceSchema>>({
    resolver: zodResolver(supplierServiceSchema),
    defaultValues: {
      supplierServiceId: defaultService.id,
      startTime: "",
      endTime: "",
      agreedRate: defaultService.baseRate,
      quantity: 1,
      notes: "",
    },
  });

  // When service is selected, update the agreed rate to the base rate
  const handleServiceChange = (serviceId: string) => {
    const service = supplier.services.find((s) => s.id === parseInt(serviceId));
    if (service) {
      const quantity = form.getValues("quantity") || 1;
      form.setValue("agreedRate", service.baseRate);
    }
  };

  const handleSubmit = (values: z.infer<typeof supplierServiceSchema>) => {
    if (!selectedDate) return;

    // Combine date with time inputs to create proper timestamps
    const startDateTime = new Date(selectedDate);
    const [startHours, startMinutes] = values.startTime.split(":");
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endDateTime = new Date(selectedDate);
    const [endHours, endMinutes] = values.endTime.split(":");
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    // Destructure to separate quantity from the rest of the form data
    const { quantity, ...submissionData } = values;

    onSubmit({
      ...submissionData,
      eventId: parseFloat(eventId as string),
      supplierId: supplier.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    });
  };

  const calculatedTotal = useMemo(() => {
    const quantity = form.watch("quantity") || 0;
    const agreedRate = form.watch("agreedRate") || 0;
    return quantity * agreedRate;
  }, [form.watch("quantity"), form.watch("agreedRate")]);

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
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supplier.services.map((service) => (
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
              <FormLabel>Rate per Unit (₱)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    field.onChange(value);
                  }}
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

        <div className="space-y-4">
          {/* Display calculated total */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Total Cost</p>
              <p className="text-xs text-muted-foreground">
                {form.watch("quantity")} × ₱{form.watch("agreedRate")}
              </p>
            </div>
            <div className="text-2xl font-bold">
              ₱{calculatedTotal.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit">
              Add Supplier (₱{calculatedTotal.toFixed(2)})
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
