"use client";

import {
    Cpu,
    Coffee,
    Cloud,
    Code2,
    Layers,
    Hexagon,
    Gem,
    Atom,
    Table,
    Box,
    FileCode,
    Zap,
    Shield,
    Database,
    Layout,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TechIconProps {
    name: string;
    className?: string;
}

export const TechIcon = ({ name, className }: TechIconProps) => {
    switch (name.toLowerCase()) {
        case "java":
            return <img src="/logos/java.svg" className={cn(className, "object-contain")} alt="Java" />;
        case "python":
            return <img src="/logos/python.svg" className={cn(className, "object-contain")} alt="Python" />;
        case "go":
        case "golang":
            return <img src="/logos/go.svg" className={cn(className, "object-contain")} alt="Go" />;
        case "javascript":
        case "js":
            return <img src="/logos/javascript.svg" className={cn(className, "object-contain")} alt="JavaScript" />;
        case "typescript":
        case "ts":
            return <img src="/logos/typescript.svg" className={cn(className, "object-contain")} alt="TypeScript" />;
        case "kotlin":
            return <img src="/logos/kotlin.svg" className={cn(className, "object-contain")} alt="Kotlin" />;
        case "ruby":
            return <img src="/logos/ruby.svg" className={cn(className, "object-contain")} alt="Ruby" />;
        case "csharp":
        case "c#":
            return <img src="/logos/csharp.svg" className={cn(className, "object-contain")} alt="C#" />;
        case "c++":
        case "cplusplus":
            return <img src="/logos/cplusplus.svg" className={cn(className, "object-contain")} alt="C++" />;
        case "php":
            return <img src="/logos/php.png" className={cn(className, "object-contain")} alt="PHP" />;
        case "docker":
            return (
                <svg viewBox="0 0 24 24" fill="#2496ED" className={className}>
                    <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.185V9.006a.185.185 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.186v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118c.102 0 .185-.083.185-.186V3.575a.186.186 0 0 0-.185-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.083.186.185.186m0 2.715h2.118c.102 0 .185-.083.185-.186V6.29a.185.185 0 0 0-.185-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.954 2.715h2.119c.101 0 .185-.083.185-.185V9.006a.185.185 0 0 0-.185-.186h-2.119a.186.186 0 0 0-.186.186v1.888c0 .102.084.185.186.185m-2.955 0h2.119c.102 0 .185-.083.185-.185V9.006a.185.185 0 0 0-.185-.186H5.12c-.103 0-.186.083-.186.186v1.888c0 .102.083.185.186.185m-2.955 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H2.165c-.102 0-.185.083-.185.186v1.888c0 .102.083.185.185.185m0-2.715h2.119a.185.185 0 0 0 .185-.185V6.29a.185.185 0 0 0-.185-.185H2.165c-.102 0-.185.083-.185.185v1.887c0 .102.083.186.185.186m2.955 0h2.119a.185.185 0 0 0 .185-.185V6.29a.185.185 0 0 0-.185-.185H5.12c-.103 0-.186.083-.186.185v1.887c0 .102.083.186.186.186m2.955 0h2.119a.185.185 0 0 0 .185-.185V6.29a.185.185 0 0 0-.185-.185h-2.119a.185.185 0 0 0-.186.185v1.887c0 .102.084.186.186.186m-5.91 5.43h2.119a.185.185 0 0 0 .185-.185v-1.887a.185.185 0 0 0-.185-.186H5.12c-.103 0-.186.083-.186.186v1.887c0 .102.083.185.186.185m-2.955 0h2.119a.185.185 0 0 0 .185-.185v-1.887a.185.185 0 0 0-.185-.186H2.165c-.102 0-.185.083-.185.186v1.887c0 .102.083.185.185.185m12.873.834c.044-.092.064-.194.062-.297v-2.072a.185.185 0 0 0-.185-.185h-2.119a.185.185 0 0 0-.185.185v2.072c-.002.103.018.205.062.297.05.106.111.196.185.275h2.012c.074-.079.135-.169.185-.275m1.536 2.302c-2.286-.013-5.884-.145-7.814-.908-.125-.05-.189-.19-.151-.316.083-.262.111-.53.084-.799-.026-.263-.122-.511-.277-.723a.185.185 0 0 0-.298-.016l-.805 1.07a.185.185 0 0 0 .015.241c1.396 1.258 3.524 1.57 6.47 1.58H23.57a.185.185 0 0 0 .185-.186v-.729a.185.185 0 0 0-.185-.185zM23.99 8.243c-.482-.828-1.503-1.631-2.951-1.631-.418-.002-.832.074-1.22.222-.888.337-1.42.92-1.92 1.464-.476.516-.906.983-1.683.983h-.183a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185h.063c1.782-.016 3.197-.819 4.39-1.93 1.05-1.026 1.76-1.583 2.97-1.583.13 0 .25.02.37.058a.184.184 0 0 0 .224-.131c.074-.282.109-.571.103-.86z"/>
                </svg>
            );
        case "aws":
            return (
                <svg viewBox="0 0 24 24" fill="#FF9900" className={className}>
                    <path d="M12.19 5.562c-.753-.086-1.517-.123-2.28-.11-2.316 0-3.953.94-3.953 3.528 0 2.215 1.481 3.256 3.655 3.256 1.34.025 2.66-.418 3.69-1.24v.933c-.015.688-.415 1.045-1.22 1.085-1.027.027-2.05-.157-3.003-.548a.499.499 0 0 0-.643.284l-.513 1.258a.5.5 0 0 0 .204.606c1.474.836 3.135 1.272 4.823 1.266 2.176 0 3.864-1.072 3.864-3.722v-6.6a.5.5 0 0 0-.5-.5h-1.464a.5.5 0 0 0-.482.37l-.273.916v-.083zm-2.28 5.485c-.947-.008-1.636-.453-1.636-1.492 0-1.127.818-1.564 2.115-1.564.605-.008 1.21.05 1.802.172v1.392a2.89 2.89 0 0 1-2.28 1.492zm13.11 3.684a16.892 16.892 0 0 1-17.7 2.69.5.5 0 0 1-.225-.668l.453-.948a.5.5 0 0 1 .632-.245 15.006 15.006 0 0 0 16.58-2.298.5.5 0 0 1 .71.705l-.45.474zm-2.583-1.393c.123.112.186.273.17.437l-.278 2.825a.434.434 0 0 1-.723.238l-1.002-.916a.434.434 0 0 1-.035-.613l1.868-1.971z"/>
                </svg>
            );
        case "node.js":
            return (
                <svg viewBox="0 0 24 24" fill="#339933" className={className}>
                    <path d="M12.152 2.604a1.2 1.2 0 0 0-.612.176L3.92 7.155a1.2 1.2 0 0 0-.596 1.04v8.61a1.2 1.2 0 0 0 .596 1.037l7.622 4.377a1.2 1.2 0 0 0 1.22 0l7.622-4.377a1.2 1.2 0 0 0 .596-1.037v-8.61a1.2 1.2 0 0 0-.596-1.04l-7.622-4.375a1.2 1.2 0 0 0-.61-.176zM12 4.148l6.816 3.913v7.878L12 19.852l-6.816-3.913V8.06z"/>
                </svg>
            );
        case "react":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" className={className}>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(0 12 12)" />
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" />
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" />
                    <circle cx="12" cy="12" r="2" fill="#61DAFB" />
                </svg>
            );
        case "angular":
            return (
                <svg viewBox="0 0 24 24" fill="#DD0031" className={className}>
                    <path d="M12 2.5L2.3 5.9l1.5 11.6L12 22.5l8.2-5L21.7 5.9zM12 4.5l6.5 2.3-.9 8.2-5.6 3.4-5.6-3.4-.9-8.2zM12 7.1L8.3 15h2.1l.8-2.1h3.6l.8 2.1h2.1zm0 2.2l1.2 3.1h-2.4z"/>
                </svg>
            );
        case "sql":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
                </svg>
            );
        case "next.js":
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.83 14.88l-6.42-8.31V16.5H8.1V7.5h1.27l6.39 8.27V7.5h1.31v9.38h-1.24z"/>
                </svg>
            );
        case "mern stack":
            return <Layers className={cn(className, "text-primary")} />;
        case "spring":
            return (
                <svg viewBox="0 0 24 24" fill="none" className={className}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.33 11.23c-.76.76-1.83 1.15-2.9 1.15s-2.14-.39-2.9-1.15l-2.67 2.67c-.24.24-.56.36-.88.36s-.64-.12-.88-.36a1.24 1.24 0 0 1 0-1.76l2.67-2.67c-.76-.76-1.15-1.83-1.15-2.9s.39-2.14 1.15-2.9 1.83-1.15 2.9-1.15 2.14.39 2.9 1.15 1.15 1.83 1.15 2.9-.39 2.14-1.15 2.9h-.79z" fill="#6DB33F" />
                </svg>
            );
        case "html5":
            return (
                <svg viewBox="0 0 24 24" fill="#E34F26" className={className}>
                    <path d="M1.5 2h21l-1.91 18.56L12 22l-8.59-1.44L1.5 2zm10.5 2.98v14.04l5.35-.9 1.3-12.75L12 4.98z" />
                </svg>
            );
        case "pytorch":
            return <Cpu className={cn(className, "text-[#EE4C2C]")} />;
        case "spark":
            return <Zap className={cn(className, "text-[#E25A1C]")} />;
        default:
            return <Globe className={className} />;
    }
};

