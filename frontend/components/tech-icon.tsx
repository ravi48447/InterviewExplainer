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
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#E76F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M12 10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2m6 0c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2" />
                    <path d="M18 10c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2m6 0c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2" />
                    <path d="M10 14h4c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2" />
                    <path d="M10 6c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                </svg>
            );
        case "python":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#3776AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M12 9c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2m-2-2c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
                    <path d="M12 15c0 1.1-.9-2-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
                </svg>
            );
        case "docker":
            return <Box className={cn(className, "text-[#2496ED]")} />;
        case "aws":
            return <Cloud className={cn(className, "text-[#FF9900]")} />;
        case "node.js":
            return <Hexagon className={cn(className, "text-[#339933]")} />;
        case "react":
            return <Atom className={cn(className, "text-[#61DAFB]")} />;
        case "angular":
            return <Shield className={cn(className, "text-[#DD0031]")} />;
        case "sql":
            return <Database className={cn(className, "text-[#4479A1]")} />;
        case "go":
            return <Zap className={cn(className, "text-[#00ADD8]")} />;
        case "ruby":
            return <Gem className={cn(className, "text-[#CC342D]")} />;
        case "c++":
            return <Cpu className={cn(className, "text-[#00599C]")} />;
        case "typescript":
            return <Code2 className={cn(className, "text-[#3178C6]")} />;
        case "javascript":
            return <FileCode className={cn(className, "text-[#F7DF1E]")} />;
        case "next.js":
            return <Layout className={cn(className, "text-white")} />;
        case "mern stack":
            return <Layers className={cn(className, "text-primary")} />;
        case "spring":
            return <Coffee className={cn(className, "text-[#6DB33F]")} />;
        case "pytorch":
            return <Cpu className={cn(className, "text-[#EE4C2C]")} />;
        case "spark":
            return <Zap className={cn(className, "text-[#E25A1C]")} />;
        default:
            return <Globe className={className} />;
    }
};
