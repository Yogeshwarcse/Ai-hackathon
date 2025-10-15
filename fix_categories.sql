-- Update waste categories to match Python backend classes
-- First, clear existing categories
DELETE FROM waste_categories;

-- Insert categories that match the Python backend
INSERT INTO waste_categories (name, description, disposal_instructions, environmental_impact, points_value, co2_impact_kg, icon_name, color)
VALUES
  (
    'cardboard',
    'Cardboard boxes and packaging materials',
    'Flatten cardboard boxes. Remove any plastic windows or metal fasteners. Keep dry and clean. Place in paper recycling bin.',
    'Recycling cardboard saves trees and reduces landfill waste. Cardboard can be recycled 5-7 times before fibers become too short.',
    12,
    0.9,
    'package',
    '#10B981'
  ),
  (
    'glass',
    'Glass bottles, jars, and containers',
    'Rinse glass containers. Remove caps and labels. Place in glass recycling bin. Do not mix with other materials.',
    'Glass can be recycled infinitely without losing quality. Recycling glass saves energy and reduces mining of raw materials.',
    18,
    1.8,
    'droplet',
    '#3B82F6'
  ),
  (
    'metal',
    'Aluminum cans, steel containers, and metal packaging',
    'Rinse metal containers. Crush cans to save space. Remove labels if possible. Place in metal recycling bin.',
    'Recycling aluminum saves 95% of energy needed to produce new aluminum. Steel recycling saves 60% of production energy.',
    20,
    2.5,
    'shield',
    '#6B7280'
  ),
  (
    'paper',
    'Newspapers, office paper, and paper packaging',
    'Keep paper dry and clean. Remove any plastic windows or metal fasteners. Place in paper recycling bin.',
    'Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and prevents 1 ton of CO2 emissions.',
    10,
    0.8,
    'file-text',
    '#10B981'
  ),
  (
    'plastic',
    'Plastic containers, bottles, bags, and packaging materials',
    'Clean and dry plastic items. Remove caps and labels. Place in recycling bin marked for plastics. Check local recycling codes.',
    'Recycling 1 ton of plastic saves approximately 5,774 kWh of energy and prevents 2 tons of CO2 emissions.',
    15,
    1.2,
    'recycle',
    '#3B82F6'
  ),
  (
    'trash',
    'Non-recyclable waste and general trash',
    'Place in general waste bin. Consider if items can be recycled or composted before disposing as trash.',
    'Reducing trash reduces landfill waste and environmental impact. Always consider recycling or composting alternatives first.',
    5,
    0.1,
    'trash-2',
    '#6B7280'
  )
ON CONFLICT (name) DO NOTHING;
