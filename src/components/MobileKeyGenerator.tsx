import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Copy, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Smartphone, 
  Zap,
  Shield,
  Settings,
  Clock
} from "lucide-react";

interface FormData {
  quantity: string;
  duration: string;
  durationUnit: string;
  maxDevices: string;
  bindToDevice: boolean;
  featureFlags: string[];
  tagName: string;
  prefix: string;
  generateQrCodes: boolean;
  downloadFormat: string;
  notes: string;
}

interface ValidationErrors {
  quantity?: string;
  duration?: string;
  maxDevices?: string;
}

const MobileKeyGenerator = () => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    quantity: "",
    duration: "",
    durationUnit: "Hours",
    maxDevices: "",
    bindToDevice: false,
    featureFlags: [],
    tagName: "",
    prefix: "",
    generateQrCodes: false,
    downloadFormat: "CSV",
    notes: "",
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState<{quantity: number, tag: string} | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || quantity < 1 || quantity > 10000) {
      newErrors.quantity = "Quantity must be 1–10000.";
    }
    
    if (formData.durationUnit !== "Permanent") {
      const duration = parseFloat(formData.duration);
      if (!formData.duration || duration <= 0) {
        newErrors.duration = "Duration must be >0 or select Permanent.";
      }
    }
    
    if (formData.maxDevices) {
      const maxDevices = parseInt(formData.maxDevices);
      if (isNaN(maxDevices) || maxDevices < 0) {
        newErrors.maxDevices = "Max devices must be integer ≥0.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    // Enhanced mobile feedback with haptic-like animation
    setTimeout(() => {
      const quantity = parseInt(formData.quantity);
      const tag = formData.tagName || `Mobile_${Date.now()}`;
      
      setGeneratedBatch({ quantity, tag });
      setIsGenerating(false);
      
      toast({
        title: "🎉 Keys Generated!",
        description: `✨ Created ${quantity} professional keys (${tag})`,
      });
    }, 2500);
  };

  const toggleFeatureFlag = (flag: string) => {
    setFormData(prev => ({
      ...prev,
      featureFlags: prev.featureFlags.includes(flag)
        ? prev.featureFlags.filter(f => f !== flag)
        : [...prev.featureFlags, flag]
    }));
  };

  const estimatedSize = Math.ceil(parseInt(formData.quantity || "0") * 0.5);

  const sections = [
    { icon: Settings, title: "Basic Setup", color: "primary" },
    { icon: Clock, title: "Timing", color: "secondary" },
    { icon: Shield, title: "Security", color: "accent" },
    { icon: Sparkles, title: "Features", color: "success" },
  ];

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="animate-bounce-in">
          <Key className="h-12 w-12 text-primary animate-pulse-glow" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-safe">
        {/* Mobile Hero Header */}
        <div className="relative overflow-hidden bg-gradient-primary text-white">
          <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
          <div className="relative px-6 py-12 text-center">
            <div className="animate-bounce-in">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Key className="h-10 w-10 animate-float" />
              </div>
              <h1 className="mb-2 text-3xl font-bold">TokenCraft+</h1>
              <p className="text-white/90">Professional Key Management</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Success Banner */}
          {generatedBatch && (
            <Card className="mb-6 animate-bounce-in border-success/30 bg-gradient-success/10 shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-success">Success!</h3>
                    <p className="text-sm text-success/80">
                      Generated {generatedBatch.quantity} keys ({generatedBatch.tag})
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="success" size="mobile" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="mobile">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Section Navigation */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={`flex min-w-[100px] flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 ${
                    activeSection === index
                      ? 'bg-gradient-primary text-white shadow-medium scale-105'
                      : 'bg-white/80 text-muted-foreground hover:bg-white hover:scale-105'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Form Sections */}
          <div className="space-y-6">
            {/* Basic Setup */}
            {activeSection === 0 && (
              <Card className="animate-fade-in bg-gradient-card shadow-soft border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-primary" />
                    Basic Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className={`h-12 text-base rounded-xl ${errors.quantity ? "border-destructive animate-pulse" : ""}`}
                    />
                    {errors.quantity && (
                      <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                        <AlertCircle className="h-4 w-4" />
                        {errors.quantity}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Tag / Batch Name</Label>
                    <Input
                      placeholder="e.g. SummerPromo_2025"
                      value={formData.tagName}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagName: e.target.value }))}
                      className="h-12 text-base rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timing Section */}
            {activeSection === 1 && (
              <Card className="animate-fade-in bg-gradient-card shadow-soft border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-secondary" />
                    Timing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Duration</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 24"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      disabled={formData.durationUnit === "Permanent"}
                      className={`h-12 text-base rounded-xl ${errors.duration ? "border-destructive animate-pulse" : ""}`}
                    />
                    {errors.duration && (
                      <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                        <AlertCircle className="h-4 w-4" />
                        {errors.duration}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Duration Unit</Label>
                    <Select
                      value={formData.durationUnit}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, durationUnit: value }))}
                    >
                      <SelectTrigger className="h-12 text-base rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Minutes">Minutes</SelectItem>
                        <SelectItem value="Hours">Hours</SelectItem>
                        <SelectItem value="Days">Days</SelectItem>
                        <SelectItem value="Weeks">Weeks</SelectItem>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Section */}
            {activeSection === 2 && (
              <Card className="animate-fade-in bg-gradient-card shadow-soft border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-accent" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Max Devices per Key</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 1 (device bound)"
                      value={formData.maxDevices}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDevices: e.target.value }))}
                      className={`h-12 text-base rounded-xl ${errors.maxDevices ? "border-destructive animate-pulse" : ""}`}
                    />
                    {errors.maxDevices && (
                      <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                        <AlertCircle className="h-4 w-4" />
                        {errors.maxDevices}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Key Prefix (Optional)</Label>
                    <Input
                      placeholder="e.g. RNBW-"
                      value={formData.prefix}
                      onChange={(e) => setFormData(prev => ({ ...prev, prefix: e.target.value }))}
                      className="h-12 text-base rounded-xl"
                    />
                  </div>

                  <div className="flex items-center space-x-3 rounded-xl bg-accent/10 p-4">
                    <Checkbox
                      id="bindToDevice"
                      checked={formData.bindToDevice}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, bindToDevice: !!checked }))}
                      className="h-5 w-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="bindToDevice" className="text-base font-medium">
                        Bind to Device
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Lock key to first device used
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Section */}
            {activeSection === 3 && (
              <Card className="animate-fade-in bg-gradient-card shadow-soft border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-success" />
                    Features & Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Feature Flags</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Premium", "Analytics", "API Access", "Export", "Collaboration", "Advanced"].map((flag) => (
                        <Badge
                          key={flag}
                          variant={formData.featureFlags.includes(flag) ? "default" : "outline"}
                          className="cursor-pointer hover:scale-105 transition-all duration-200 justify-center py-2 h-auto"
                          onClick={() => toggleFeatureFlag(flag)}
                        >
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Download Format</Label>
                    <RadioGroup
                      value={formData.downloadFormat}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, downloadFormat: value }))}
                      className="grid grid-cols-3 gap-3"
                    >
                      {["CSV", "ZIP", "TXT"].map((format) => (
                        <div key={format} className="flex items-center space-x-2 rounded-lg border p-3">
                          <RadioGroupItem value={format} id={format} />
                          <Label htmlFor={format} className="flex-1 text-center font-medium">
                            {format}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-3 rounded-xl bg-primary/10 p-4">
                    <Checkbox
                      id="generateQrCodes"
                      checked={formData.generateQrCodes}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, generateQrCodes: !!checked }))}
                      className="h-5 w-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="generateQrCodes" className="text-base font-medium">
                        Include QR Codes
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Generate QR for each key
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Notes (Optional)</Label>
                    <Textarea
                      placeholder="Add internal notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="rounded-xl resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mobile Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-4 safe-area-pb">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">
                {formData.quantity && (
                  <span className="flex items-center gap-1">
                    <Smartphone className="h-4 w-4" />
                    ~{estimatedSize} KB
                  </span>
                )}
              </div>
              <div className="text-sm font-medium text-primary">
                {activeSection + 1} / {sections.length}
              </div>
            </div>
            
            <div className="flex gap-3">
              {activeSection > 0 && (
                <Button 
                  variant="outline" 
                  size="mobile"
                  onClick={() => setActiveSection(prev => prev - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              
              {activeSection < sections.length - 1 ? (
                <Button 
                  variant="mobile" 
                  size="mobile"
                  onClick={() => setActiveSection(prev => prev + 1)}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  variant="glow"
                  size="mobile"
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <Key className="h-5 w-5 mr-2" />
                      Generate {formData.quantity || "Keys"} 🚀
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MobileKeyGenerator;