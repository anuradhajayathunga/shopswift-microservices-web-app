import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FaqAndNewsletter() {
  return (
    <section className="bg-muted/30 border-y border-border/50 py-16 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Accordion */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Why join hype Società?
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium">
                Early Access to Drops
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Get notified before anyone else when new collections go live.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm font-medium">
                Exclusive Discounts & Offers
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Members receive special pricing during holiday events.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm font-medium">
                Priority Notifications
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Skip the queue with our premium notification system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right: Newsletter Card */}
        <div className="lg:pl-12">
          <Card className="border-border/60 shadow-sm bg-background">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-lg font-semibold tracking-tight">
                Join hype Società
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign up to get first dibs on new arrivals, sales, and exclusive
                offers.
              </p>
              <div className="flex gap-2 pt-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-muted/50"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
