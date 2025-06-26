'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { Article } from '@/types';
import { updateArticleAction } from '@/app/actions';
import { CATEGORIES } from '@/lib/config';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FormSubmitButton } from '@/components/admin/form-submit-button';


const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
  category: z.enum(CATEGORIES),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters.'),
  published: z.boolean(),
});

export function ArticleForm({ article }: { article: Article }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article.title || '',
      content: article.content || '',
      category: article.category as any,
      metaDescription: article.metaDescription || '',
      published: article.published || false,
    },
  });

  const [state, formAction] = useFormState(updateArticleAction.bind(null, article.id), {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'Article has been updated successfully.',
      });
      router.push('/admin');
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error updating article',
        description: state.error,
      });
    }
  }, [state, router, toast]);

  return (
    <Form {...form}>
        <form action={formAction} className="space-y-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter article title" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter meta description for SEO" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content (HTML)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter article content in HTML" {...field} rows={15} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Published</FormLabel>
                                <FormDescription>
                                    Make this article visible to the public.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin')}>Cancel</Button>
                <FormSubmitButton>Save Changes</FormSubmitButton>
            </div>
        </form>
    </Form>
  );
}
