import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heart, Calendar, Users } from "lucide-react";
import { z } from "zod";

const setupSchema = z.object({
  bride: z.string().min(1, "Bride's name is required"),
  groom: z.string().min(1, "Groom's name is required"),
  weddingDate: z.string().min(1, "Wedding date is required"),
});

type SetupData = z.infer<typeof setupSchema>;

interface SetupProps {
  onComplete: (data: SetupData) => void;
}

export default function Setup({ onComplete }: SetupProps) {
  const form = useForm<SetupData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      bride: "",
      groom: "",
      weddingDate: "",
    },
  });

  const onSubmit = (data: SetupData) => {
    onComplete(data);
  };

  return (
    <div className="min-h-screen bg-pastel-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center pb-6">
          <div className="bg-pastel-green-200 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-pastel-green-600" />
          </div>
          <CardTitle className="text-2xl font-heading font-bold text-gray-800">
            Welcome to Blissful Planner
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Let's get started by setting up your wedding details
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bride"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Bride's Name</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bride's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Groom's Name</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter groom's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weddingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Wedding Date</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-pastel-green-400 hover:bg-pastel-green-500 text-white rounded-soft mt-6"
              >
                Start Planning Your Wedding
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}