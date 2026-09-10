import * as React from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
 href: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
 ({ className, href, children, ...props }, ref) => (
 <Link href={href} className="block h-full">
 <div
 ref={ref}
 className={cn(
 "group h-full relative bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary/30 hover:-translate-y-[6px] transition-all duration-250 ease-out",
 className
 )}
 {...props}
 >
 {children}
 </div>
 </Link>
 )
)
FeatureCard.displayName = "FeatureCard"

const FeatureCardIcon = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement> & { gradient?: string }
>(({ className, gradient, children, ...props }, ref) => (
 <div
 ref={ref}
 className={cn(
 "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-250 ease-out",
 gradient ? `bg-gradient-to-br ${gradient}` : "bg-primary/10",
 className
 )}
 {...props}
 >
 {children}
 </div>
))
FeatureCardIcon.displayName = "FeatureCardIcon"

const FeatureCardHeader = React.forwardRef<
 HTMLHeadingElement,
 React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
 <h3
 ref={ref}
 className={cn(
 "text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-250 ease-out",
 className
 )}
 {...props}
 />
))
FeatureCardHeader.displayName = "FeatureCardHeader"

const FeatureCardContent = React.forwardRef<
 HTMLParagraphElement,
 React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
 <p
 ref={ref}
 className={cn("text-sm text-muted-foreground leading-relaxed mb-4", className)}
 {...props}
 />
))
FeatureCardContent.displayName = "FeatureCardContent"

const FeatureCardFooter = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
 <div
 ref={ref}
 className={cn("flex items-center justify-between pt-3 border-t border-border", className)}
 {...props}
 >
 {children}
 <FeatureCardArrow />
 </div>
))
FeatureCardFooter.displayName = "FeatureCardFooter"

const FeatureCardArrow = React.forwardRef<
 SVGSVGElement,
 React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => (
 <ArrowRight
 ref={ref}
 className={cn(
 "h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-250 ease-out",
 className
 )}
 {...props}
 />
))
FeatureCardArrow.displayName = "FeatureCardArrow"

export { FeatureCard, FeatureCardHeader, FeatureCardIcon, FeatureCardContent, FeatureCardFooter, FeatureCardArrow }
