import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrismaClient } from '@prisma/client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const prisma = new PrismaClient();

const formSchema = z.object({
  lokasi: z.string().min(3, {
    message: "Lokasi must be at least 3 characters.",
  }),
  gedung: z.string().min(3, {
    message: "Gedung must be at least 3 characters.",
  }),
  ruangan: z.string().min(3, {
    message: "Ruangan must be at least 3 characters.",
  }),
});

export function LokasiForm({onSave}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lokasi: "",
      gedung: "",
      ruangan: "",
    },
  });

  async function onSubmit(values) {
    try {
      const lokasi = await prisma.lokasi.create({
        data: {
          lokasi: values.lokasi,
          gedung: values.gedung,
          ruangan: values.ruangan,
        },
      });
      console.log(lokasi);
      onSave();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="lokasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl>
                <Input placeholder="Specify a Lokasi" {...field} />
              </FormControl>
              <FormDescription>Give a valid Lokasi</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gedung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gedung</FormLabel>
              <FormControl>
                <Input placeholder="Specify a Gedung" {...field} />
              </FormControl>
              <FormDescription>Give a valid Gedung</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ruangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ruangan</FormLabel>
              <FormControl>
                <Input placeholder="Specify a Ruangan" {...field} />
              </FormControl>
              <FormDescription>Give a valid Ruangan</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}