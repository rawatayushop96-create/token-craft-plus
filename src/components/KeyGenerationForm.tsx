import { useState } from "react";
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
import { Download, Copy, Key, AlertCircle, CheckCircle2, Info } from "lucide-react";

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

const KeyGenerationForm = () => {
  const { toast } = useToast();
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
    
    // Simulate API call
    setTimeout(() => {
      const quantity = parseInt(formData.quantity);
      const tag = formData.tagName || `Batch_${Date.now()}`;
      
      setGeneratedBatch({ quantity, tag });
      setIsGenerating(false);
      
      toast({
        title: "Keys Generated Successfully",
        description: `✅ Generated ${quantity} keys (batch ${tag}).`,
      });
    }, 2000);
  };

  const toggleFeatureFlag = (flag: string) => {
    setFormData(prev => ({
      ...prev,
      featureFlags: prev.featureFlags.includes(flag)
        ? prev.featureFlags.filter(f => f !== flag)
        : [...prev.featureFlags, flag]
    }));
  };

  const estimatedSize = Math.ceil(parseInt(formData.quantity || "0") * 0.5); // Rough estimate in KB

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Key Generator</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Create temporary or permanent keys and control device limits, expiry, and features
            </p>
          </div>

          {generatedBatch && (
            <Card className="mb-6 border-success bg-success/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-success font-medium">
                    ✅ Generated {generatedBatch.quantity} keys (batch {generatedBatch.tag}).
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button size="sm" className="bg-success hover:bg-success/90">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy sample key
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Generation Settings</CardTitle>
              <CardDescription>
                Configure your key generation parameters below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        How many keys to generate (max 10,000 per request).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className={errors.quantity ? "border-destructive" : ""}
                  />
                  {errors.quantity && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.quantity}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tagName">Tag / Batch Name</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        A label for this batch—useful for search & revoke.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="tagName"
                    placeholder="e.g. SummerPromo_2025"
                    value={formData.tagName}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagName: e.target.value }))}
                  />
                </div>
              </div>

              {/* Duration Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        How long key is valid. Leave blank for permanent.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g. 24"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    disabled={formData.durationUnit === "Permanent"}
                    className={errors.duration ? "border-destructive" : ""}
                  />
                  {errors.duration && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.duration}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Duration Unit</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Choose unit for the Duration. "Permanent" ignores Duration.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={formData.durationUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, durationUnit: value }))}
                  >
                    <SelectTrigger>
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
              </div>

              {/* Device Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="maxDevices">Max Devices per Key</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        How many different devices can activate with this key. 0 = unlimited.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="maxDevices"
                    type="number"
                    placeholder="e.g. 1 (device bound)"
                    value={formData.maxDevices}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDevices: e.target.value }))}
                    className={errors.maxDevices ? "border-destructive" : ""}
                  />
                  {errors.maxDevices && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.maxDevices}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="prefix">Prefix/Format (optional)</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Optional key prefix, or leave blank to auto-generate format.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="prefix"
                    placeholder="e.g. RNBW-"
                    value={formData.prefix}
                    onChange={(e) => setFormData(prev => ({ ...prev, prefix: e.target.value }))}
                  />
                </div>
              </div>

              {/* Feature Flags */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Feature Flags / Entitlements</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Which app features this key unlocks (optional).
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Premium", "Analytics", "API Access", "Export", "Collaboration", "Advanced Settings"].map((flag) => (
                    <Badge
                      key={flag}
                      variant={formData.featureFlags.includes(flag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => toggleFeatureFlag(flag)}
                    >
                      {flag}
                    </Badge>
                  ))}
                </div>
                {formData.featureFlags.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {formData.featureFlags.join(", ")}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bindToDevice"
                    checked={formData.bindToDevice}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, bindToDevice: !!checked }))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="bindToDevice" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Bind to Device
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          If checked, the key will bind to a device fingerprint upon first use.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="generateQrCodes"
                    checked={formData.generateQrCodes}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, generateQrCodes: !!checked }))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="generateQrCodes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        QR Codes
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Generate a QR code for each key (zip download).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Format */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Download Format</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Choose how to export keys after generation.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <RadioGroup
                  value={formData.downloadFormat}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, downloadFormat: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CSV" id="csv" />
                    <Label htmlFor="csv">CSV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ZIP" id="zip" />
                    <Label htmlFor="zip">ZIP (JSON+QR)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TXT" id="txt" />
                    <Label htmlFor="txt">TXT</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Optional internal note for this batch.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  id="notes"
                  placeholder="Optional internal notes for this batch..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  {formData.quantity && (
                    <span>Estimated payload size: ~{estimatedSize} KB</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => {
                    setFormData({
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
                    setErrors({});
                    setGeneratedBatch(null);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="min-w-[140px]"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Generate {formData.quantity || "X"} keys
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default KeyGenerationForm;