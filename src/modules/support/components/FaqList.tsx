import React from 'react';
import { Card } from '../../../components/ui/card';
import { useSupportViewModel } from '../viewmodel/supportViewModel';

export default function FaqList() {
  const { faqs, loading } = useSupportViewModel();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {faqs.map((faq: any) => (
            <Card key={faq.id} className="p-4">
              <div className="font-semibold">{faq.question}</div>
              <div className="text-muted-foreground mt-1">{faq.answer}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
