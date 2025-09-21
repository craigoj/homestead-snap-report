-- Enhanced Device Recognition: Add equipment database and barcode support
ALTER TABLE public.assets 
ADD COLUMN equipment_type JSONB DEFAULT '{}',
ADD COLUMN barcode_data TEXT,
ADD COLUMN qr_code_data TEXT,
ADD COLUMN device_specifications JSONB DEFAULT '{}';

-- Create equipment templates table
CREATE TABLE public.equipment_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT,
  equipment_name TEXT NOT NULL,
  brand_patterns TEXT[],
  typical_value_range NUMRANGE,
  common_models TEXT[],
  serial_number_patterns TEXT[],
  depreciation_rate DECIMAL(5,2) DEFAULT 0.10,
  ocr_hints JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on equipment templates
ALTER TABLE public.equipment_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for equipment templates (read-only for all authenticated users)
CREATE POLICY "Equipment templates are viewable by authenticated users" 
ON public.equipment_templates 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create error logs table for better error tracking
CREATE TABLE public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  error_type TEXT NOT NULL,
  error_message TEXT,
  error_context JSONB DEFAULT '{}',
  retry_count INTEGER DEFAULT 0,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on error logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for error logs
CREATE POLICY "Users can create error logs" 
ON public.error_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own error logs" 
ON public.error_logs 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Add trigger for equipment templates updated_at
CREATE TRIGGER update_equipment_templates_updated_at
BEFORE UPDATE ON public.equipment_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert comprehensive equipment templates
INSERT INTO public.equipment_templates (category, subcategory, equipment_name, brand_patterns, typical_value_range, common_models, serial_number_patterns, depreciation_rate, ocr_hints) VALUES
-- Kitchen Appliances
('appliances', 'kitchen', 'Refrigerator', ARRAY['Samsung', 'LG', 'Whirlpool', 'GE', 'Frigidaire', 'KitchenAid'], '[800,3000]', ARRAY['French Door', 'Side-by-Side', 'Top Freezer'], ARRAY['[A-Z]{2}[0-9]{8}', '[0-9]{10,12}'], 0.15, '{"serial_location": "inside door or back panel", "model_location": "inside refrigerator or door"}'),
('appliances', 'kitchen', 'Dishwasher', ARRAY['Bosch', 'KitchenAid', 'Whirlpool', 'GE', 'Samsung'], '[400,1200]', ARRAY['Built-in', 'Portable', 'Drawer'], ARRAY['[A-Z]{3}[0-9]{6}', '[0-9]{8,10}'], 0.12, '{"serial_location": "door frame or side panel", "model_location": "control panel or door"}'),
('appliances', 'kitchen', 'Microwave', ARRAY['Panasonic', 'Sharp', 'GE', 'Samsung', 'LG'], '[100,500]', ARRAY['Countertop', 'Over-range', 'Built-in'], ARRAY['[A-Z]{2}[0-9]{8}', '[0-9]{10}'], 0.20, '{"serial_location": "back or side panel", "model_location": "control panel or door"}'),

-- HVAC Systems
('appliances', 'hvac', 'Air Conditioner', ARRAY['Carrier', 'Trane', 'Lennox', 'Rheem', 'Goodman'], '[1500,8000]', ARRAY['Central', 'Window', 'Portable', 'Mini-Split'], ARRAY['[0-9]{10,12}', '[A-Z]{2}[0-9]{8}'], 0.10, '{"serial_location": "unit nameplate", "model_location": "outdoor unit or indoor handler"}'),
('appliances', 'hvac', 'Heat Pump', ARRAY['Carrier', 'Trane', 'Lennox', 'Rheem', 'York'], '[3000,12000]', ARRAY['Air Source', 'Ground Source', 'Hybrid'], ARRAY['[0-9]{10,12}', '[A-Z]{3}[0-9]{7}'], 0.08, '{"serial_location": "unit nameplate", "model_location": "outdoor unit"}'),
('appliances', 'hvac', 'Thermostat', ARRAY['Nest', 'Honeywell', 'Ecobee', 'Carrier', 'Trane'], '[50,400]', ARRAY['Smart', 'Programmable', 'Manual'], ARRAY['[A-Z0-9]{8,12}'], 0.25, '{"serial_location": "back of device", "model_location": "display or back"}'),

-- Electronics
('electronics', 'audio_video', 'Television', ARRAY['Samsung', 'LG', 'Sony', 'TCL', 'Hisense'], '[300,3000]', ARRAY['LED', 'OLED', 'QLED', '4K', '8K'], ARRAY['[A-Z]{2}[0-9]{8}', '[0-9]{10,12}'], 0.18, '{"serial_location": "back panel sticker", "model_location": "back panel or menu"}'),
('electronics', 'computing', 'Laptop', ARRAY['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS'], '[500,3000]', ARRAY['MacBook', 'ThinkPad', 'Inspiron', 'Pavilion'], ARRAY['[A-Z0-9]{10,12}'], 0.25, '{"serial_location": "bottom panel or battery compartment", "model_location": "keyboard area or system info"}'),
('electronics', 'computing', 'Desktop', ARRAY['Dell', 'HP', 'Apple', 'Custom Build'], '[400,5000]', ARRAY['Tower', 'All-in-One', 'Mini PC', 'Workstation'], ARRAY['[A-Z0-9]{8,12}'], 0.20, '{"serial_location": "back or side panel", "model_location": "front or system info"}'),

-- Automotive
('automotive', 'vehicle', 'Car', ARRAY['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW'], '[5000,80000]', ARRAY['Sedan', 'SUV', 'Truck', 'Coupe'], ARRAY['[A-Z0-9]{17}'], 0.15, '{"serial_location": "VIN on dashboard or door", "model_location": "registration or dashboard"}'),
('automotive', 'vehicle', 'Motorcycle', ARRAY['Harley-Davidson', 'Honda', 'Yamaha', 'Kawasaki'], '[3000,30000]', ARRAY['Cruiser', 'Sport', 'Touring', 'Dirt'], ARRAY['[A-Z0-9]{17}'], 0.18, '{"serial_location": "frame near engine", "model_location": "registration or frame"}'),

-- Tools
('tools', 'power', 'Drill', ARRAY['DeWalt', 'Milwaukee', 'Makita', 'Ryobi', 'Black+Decker'], '[50,300]', ARRAY['Cordless', 'Corded', 'Hammer', 'Impact'], ARRAY['[A-Z0-9]{8,12}'], 0.15, '{"serial_location": "motor housing or battery compartment", "model_location": "handle or nameplate"}'),
('tools', 'power', 'Saw', ARRAY['DeWalt', 'Milwaukee', 'Makita', 'Bosch'], '[100,800]', ARRAY['Circular', 'Miter', 'Jigsaw', 'Reciprocating'], ARRAY['[A-Z0-9]{8,12}'], 0.12, '{"serial_location": "motor housing", "model_location": "nameplate or handle"}');

-- Create indexes for better performance
CREATE INDEX idx_equipment_templates_category ON public.equipment_templates(category);
CREATE INDEX idx_equipment_templates_subcategory ON public.equipment_templates(subcategory);
CREATE INDEX idx_assets_equipment_type ON public.assets USING GIN(equipment_type);
CREATE INDEX idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX idx_error_logs_error_type ON public.error_logs(error_type);