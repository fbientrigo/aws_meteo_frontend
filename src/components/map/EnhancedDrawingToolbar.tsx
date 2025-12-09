import { useState } from 'react';
import { Pen, Edit, Trash2, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface EnhancedDrawingToolbarProps {
    onToolSelect: (tool: 'polygon' | 'edit' | 'delete' | 'measure' | null) => void;
    activeTool: string | null;
}

const EnhancedDrawingToolbar = ({
    onToolSelect,
    activeTool
}: EnhancedDrawingToolbarProps) => {
    const tools = [
        {
            id: 'polygon',
            label: 'Dibujar',
            icon: Pen,
            description: 'Dibuja un polígono personalizado',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            hoverColor: 'hover:bg-blue-500/20'
        },
        {
            id: 'edit',
            label: 'Editar',
            icon: Edit,
            description: 'Modifica polígonos existentes',
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            hoverColor: 'hover:bg-amber-500/20'
        },
        {
            id: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            description: 'Borra polígonos',
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            hoverColor: 'hover:bg-red-500/20'
        },
        {
            id: 'measure',
            label: 'Medir',
            icon: Ruler,
            description: 'Mide distancias',
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            hoverColor: 'hover:bg-green-500/20'
        }
    ];

    return (
        <TooltipProvider>
            <Card className="p-2 shadow-lg backdrop-blur-md border-2">
                <div className="flex gap-1">
                    {tools.map((tool) => (
                        <Tooltip key={tool.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeTool === tool.id ? "default" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "h-10 w-10 flex flex-col items-center justify-center transition-all p-0",
                                        activeTool === tool.id ? tool.bgColor : tool.hoverColor,
                                        "hover:scale-105"
                                    )}
                                    onClick={() => onToolSelect(activeTool === tool.id ? null : tool.id as any)}
                                >
                                    <tool.icon className={cn("w-5 h-5", tool.color)} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-popover text-popover-foreground">
                                <p className="font-medium">{tool.label}</p>
                                <p className="text-xs opacity-70">{tool.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </Card>
        </TooltipProvider>
    );
};

export default EnhancedDrawingToolbar;
