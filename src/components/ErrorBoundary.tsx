import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error capturado:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-destructive" />
              <h1 className="text-2xl font-bold">Algo salió mal</h1>
              <p className="text-muted-foreground">
                La aplicación encontró un error inesperado.
              </p>
              {this.state.error && (
                <details className="w-full text-left">
                  <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                    Ver detalles del error
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button onClick={this.handleReset} className="w-full">
                Recargar aplicación
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
