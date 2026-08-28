-- Tighten storage.objects policies for 'resources' bucket to admins
DROP POLICY IF EXISTS "Authenticated users can delete resource files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resource files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resource files" ON storage.objects;

CREATE POLICY "Only admins can upload resource files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can update resource files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can delete resource files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Add UPDATE and DELETE policies on chat_messages scoped to conversation owner
CREATE POLICY "Users can update their own messages"
ON public.chat_messages FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()));

CREATE POLICY "Users can delete their own messages"
ON public.chat_messages FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()));
