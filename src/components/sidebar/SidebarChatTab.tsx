import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Droplet, Bot, User } from "lucide-react";
import { api } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";

interface Message {
    type: "user" | "bot";
    content: string;
    solution?: {
        title: string;
        description: string;
        metrics?: { label: string; value: string }[];
    };
}

const SidebarChatTab = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            type: "bot",
            content: "¡Hola! Soy tu asistente de riesgo climático. Analizo tu predio en tiempo real. ¿Qué te gustaría saber?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Get Context Data from Store
    const selectedFarm = useAppStore((state) => state.selectedFarm);
    const farmData = useAppStore((state) => state.farmData);
    const activeRisks = useAppStore((state) => state.activeRisks);
    const selectedPolygon = useAppStore((state) => state.selectedPolygon);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const suggestions = [
        "¿Qué significa el nivel de riesgo 4?",
        "¿Qué puedo hacer con la sequía en mi potrero?",
        "¿Por qué mi cultivo tiene este riesgo?"
    ];

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { type: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Prepare Context Object
        const chatContext = {
            predioActual: selectedFarm,
            potrerosActuales: farmData?.paddocks || [],
            riesgosActuales: activeRisks,
            elementoSeleccionado: selectedPolygon,
            timestamp: new Date().toISOString()
        };

        console.log("🤖 Enviando contexto al IA:", chatContext);

        try {
            // In a real implementation, we would pass chatContext to the API
            const response = await api.data.chat(input);

            const botMessage: Message = {
                type: "bot",
                content: response.message,
                solution: response.solution
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                type: "bot",
                content: "Lo siento, tengo problemas para conectar con el servidor en este momento."
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full -m-5"> {/* Negative margin to counteract padding */}
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`flex flex-col gap-2 max-w-[85%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                            <div className={`p-3 rounded-2xl text-sm ${message.type === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-muted text-foreground rounded-tl-none"
                                }`}>
                                {message.content}
                            </div>

                            {message.solution && (
                                <Card className="p-3 w-full border-l-4 border-l-primary bg-card/50">
                                    <h4 className="font-semibold text-primary flex items-center gap-2 mb-1 text-xs">
                                        <Droplet className="w-3 h-3" />
                                        {message.solution.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-2">{message.solution.description}</p>
                                    {message.solution.metrics && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {message.solution.metrics.map((metric, i) => (
                                                <div key={i} className="bg-background p-1.5 rounded text-center border">
                                                    <div className="text-[10px] text-muted-foreground uppercase">{metric.label}</div>
                                                    <div className="font-bold text-xs">{metric.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Bot className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background z-10">
                {messages.length < 3 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1.5 whitespace-normal text-left"
                                onClick={() => setInput(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <Input
                        placeholder="Pregúntame sobre tu predio..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        maxLength={500}
                        className="rounded-full"
                    />
                    <Button
                        onClick={handleSend}
                        className="rounded-full w-10 h-10 p-0 flex-shrink-0"
                        disabled={!input.trim() || isLoading}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <div className="text-[10px] text-muted-foreground text-center mt-2">
                    IA con acceso a datos de tu predio en tiempo real
                </div>
            </div>
        </div>
    );
};

export default SidebarChatTab;
