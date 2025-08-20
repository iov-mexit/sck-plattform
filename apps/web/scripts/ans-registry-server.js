const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS for cross-domain communication
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// ANS Registry endpoints
const ansRegistry = new Map();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'ANS Registry', 
    timestamp: new Date().toISOString(),
    registeredAgents: ansRegistry.size
  });
});

// Register agent to ANS
app.post('/api/v1/register', (req, res) => {
  try {
    const { 
      agentId, 
      organizationId, 
      roleName, 
      qualificationLevel, 
      trustScore, 
      ansIdentifier,
      correlationId 
    } = req.body;

    console.log(`📝 ANS Registration: ${ansIdentifier} (${correlationId})`);

    // Store agent registration
    const registration = {
      agentId,
      organizationId,
      roleName,
      qualificationLevel,
      trustScore,
      ansIdentifier,
      correlationId,
      registeredAt: new Date().toISOString(),
      status: 'active',
      verificationUrl: `http://localhost:3001/api/v1/verify/${ansIdentifier}`
    };

    ansRegistry.set(ansIdentifier, registration);

    res.json({
      success: true,
      message: 'Agent registered to ANS successfully',
      data: {
        ansIdentifier,
        verificationUrl: registration.verificationUrl,
        correlationId
      }
    });

  } catch (error) {
    console.error('❌ ANS Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register agent to ANS'
    });
  }
});

// Verify agent by ANS identifier
app.get('/api/v1/verify/:ansIdentifier', (req, res) => {
  const { ansIdentifier } = req.params;
  
  const registration = ansRegistry.get(ansIdentifier);
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found in ANS registry'
    });
  }

  res.json({
    success: true,
    data: {
      ansIdentifier,
      roleName: registration.roleName,
      qualificationLevel: registration.qualificationLevel,
      trustScore: registration.trustScore,
      registeredAt: registration.registeredAt,
      status: registration.status,
      verificationUrl: registration.verificationUrl
    }
  });
});

// List all registered agents
app.get('/api/v1/agents', (req, res) => {
  const agents = Array.from(ansRegistry.values()).map(agent => ({
    ansIdentifier: agent.ansIdentifier,
    roleName: agent.roleName,
    qualificationLevel: agent.qualificationLevel,
    trustScore: agent.trustScore,
    registeredAt: agent.registeredAt,
    status: agent.status
  }));

  res.json({
    success: true,
    data: {
      agents,
      total: agents.length
    }
  });
});

// ANS Registry dashboard
app.get('/', (req, res) => {
  const agents = Array.from(ansRegistry.values());
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ANS Registry - knaight.site</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
            .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-number { font-size: 2em; font-weight: bold; color: #2563eb; }
            .agents-grid { display: grid; gap: 15px; }
            .agent-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #2563eb; }
            .agent-id { font-family: monospace; color: #6b7280; font-size: 0.9em; }
            .agent-role { font-weight: bold; color: #1f2937; }
            .agent-level { display: inline-block; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; }
            .refresh-btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
            .refresh-btn:hover { background: #1d4ed8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔗 ANS Registry - knaight.site</h1>
                <p>Agent Name Service Registry for SCK Platform</p>
                <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${agents.length}</div>
                    <div>Registered Agents</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${new Set(agents.map(a => a.qualificationLevel)).size}</div>
                    <div>Qualification Levels</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.trustScore, 0) / agents.length) : 0}</div>
                    <div>Avg Trust Score</div>
                </div>
            </div>
            
            <div class="agents-grid">
                ${agents.length === 0 ? '<p>No agents registered yet. Create role agents in SCK Platform to see them here!</p>' : 
                  agents.map(agent => `
                    <div class="agent-card">
                        <div class="agent-id">${agent.ansIdentifier}</div>
                        <div class="agent-role">${agent.roleName}</div>
                        <div style="margin-top: 8px;">
                            <span class="agent-level">${agent.qualificationLevel}</span>
                            <span style="margin-left: 10px; color: #6b7280;">Trust: ${agent.trustScore}</span>
                        </div>
                        <div style="margin-top: 5px; font-size: 0.8em; color: #9ca3af;">
                            Registered: ${new Date(agent.registeredAt).toLocaleString()}
                        </div>
                    </div>
                  `).join('')
                }
            </div>
        </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`🔗 ANS Registry running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`📝 Register: POST http://localhost:${PORT}/api/v1/register`);
  console.log(`✅ Verify: GET http://localhost:${PORT}/api/v1/verify/:ansIdentifier`);
}); 