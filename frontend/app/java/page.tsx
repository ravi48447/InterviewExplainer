import React from 'react';
import { BookOpen, ArrowRight, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function JavaPathsPage() {
 const paths = [
 {
 id: 'java-backend-intermediate',
 type: 'Backend',
 typeColor: 'blue',
 level: 'Intermediate',
 experience: '2-5 yrs',
 title: 'Java Backend',
 description: 'Architecture, patterns & real-world scenarios for Java Backend.',
 stacksCount: 45,
 questionsCount: 45,
 href: '/java-backend-intermediate',
 },
 {
 id: 'java-fullstack-intermediate',
 type: 'Fullstack',
 typeColor: 'purple',
 level: 'Intermediate',
 experience: '2-5 yrs',
 title: 'Java Fullstack',
 description: 'Architecture, patterns & real-world scenarios for Java Fullstack.',
 stacksCount: 64,
 questionsCount: 64,
 href: '/java-fullstack-intermediate',
 },
 {
 id: 'java-backend-beginner',
 type: 'Backend',
 typeColor: 'blue',
 level: 'Beginner',
 experience: '0-2 yrs',
 title: 'Java Backend',
 description: 'Fundamentals & core concepts for Java Backend developers.',
 stacksCount: 33,
 questionsCount: 33,
 href: '/java-backend-fresher',
 },
 {
 id: 'java-fullstack-beginner',
 type: 'Fullstack',
 typeColor: 'purple',
 level: 'Beginner',
 experience: '0-2 yrs',
 title: 'Java Fullstack',
 description: 'Fundamentals & core concepts for Java Fullstack developers.',
 stacksCount: 29,
 questionsCount: 29,
 href: '/java-fullstack-fresher',
 },
 ];

 return (
 <div className="min-h-screen bg-background py-20">
 <div className="w-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
 <div className="text-center mb-16">
 <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
 <Code2 className="h-5 w-5 text-primary" />
 <span className="text-sm font-bold text-primary">Java Ecosystem</span>
 </div>
 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6">
 Java Learning Paths
 </h1>
 <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
 Structured roadmaps covering Core Java, Backend Development, Spring Boot, System Design, Microservices, and Full Stack preparation.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
 {paths.map((path) => (
 <Link href={path.href} key={path.id}>
 <div 
 className="group h-full rounded-2xl border border-border bg-card overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
 >
 <div className="p-8 flex-1">
 {/* Accent line */}
 <div 
 className={`w-12 h-1.5 rounded-full mb-6 ${
 path.typeColor === 'blue' ? 'bg-blue-500 dark:bg-blue-800' : 'bg-blue-500 dark:bg-blue-800'
 }`} 
 />
 
 {/* Tags */}
 <div className="flex items-center gap-2 mb-5 flex-wrap">
 <Badge 
 variant="outline" 
 className={`border-transparent font-medium ${
 path.typeColor === 'blue' 
 ? 'bg-blue-500/10 dark:bg-blue-500/20 text-primary dark:text-primary' 
 : 'bg-blue-500 dark:bg-blue-800/10 text-white dark:text-primary'
 }`}
 >
 {path.type}
 </Badge>
 <Badge 
 variant="outline" 
 className="bg-surface border-border text-muted-foreground font-medium"
 >
 {path.level} • {path.experience}
 </Badge>
 </div>

 {/* Content */}
 <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{path.title}</h3>
 <p className="text-base text-muted-foreground leading-relaxed mb-8">
 {path.description}
 </p>

 {/* Stats */}
 <div className="text-sm text-muted-foreground font-semibold flex items-center gap-3">
 <span>{path.stacksCount} stacks</span>
 <span className="w-1 h-1 rounded-full bg-border" />
 <span>{path.questionsCount} questions</span>
 </div>
 </div>

 {/* Footer */}
 <div className="px-8 py-5 border-t border-border flex items-center justify-between group-hover:bg-primary/5 transition-colors">
 <div className="flex items-center gap-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
 <BookOpen className="w-4 h-4" />
 Start Learning
 </div>
 <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
 </div>
 </div>
 </Link>
 ))}
 </div>
 </div>
 </div>
 );
}
