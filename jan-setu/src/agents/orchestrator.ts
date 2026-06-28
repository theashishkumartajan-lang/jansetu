import { analyzeWithGemini, compareImages, GeminiInput } from '@/services/gemini/client';
import { AgentResult, IssueCategory, SeverityLevel, Issue, ReportInput, Prediction } from '@/types';
import { CATEGORY_DEPT } from '@/data/mock';

// ——— Agent Base ———
interface AgentContext {
  input: ReportInput;
  results: Record<string, AgentResult>;
  issue?: Partial<Issue>;
}

export abstract class BaseAgent {
  abstract name: string;

  async process(ctx: AgentContext): Promise<AgentResult> {
    try {
      const output = await this.run(ctx);
      return {
        agent: this.name,
        status: 'completed',
        confidence: output.confidence ?? 0.9,
        output: output.data,
        reasoning: output.reasoning,
        timestamp: new Date(),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Agent processing failed';
      return {
        agent: this.name,
        status: 'failed',
        confidence: 0,
        output: { error: message },
        reasoning: message,
        timestamp: new Date(),
      };
    }
  }

  abstract run(ctx: AgentContext): Promise<{ data: Record<string, unknown>; confidence: number; reasoning?: string }>;
}

// ——— 1. ReportAgent ———
export class ReportAgent extends BaseAgent {
  name = 'ReportAgent';

  async run(ctx: AgentContext) {
    const geminiInput: GeminiInput = {
      text: ctx.input.description || ctx.input.voiceText || '',
      image: typeof ctx.input.image === 'string' ? ctx.input.image : undefined,
    };
    const res = await analyzeWithGemini(geminiInput);
    const structured = res.structured || {};

    return {
      data: {
        rawAnalysis: res.text,
        issue: structured.issue || 'Other',
        severity: structured.severity || 'Medium',
        description: structured.description || geminiInput.text || 'No description provided',
        confidence: res.confidence,
      },
      confidence: res.confidence,
      reasoning: `Analyzed input and identified issue as ${structured.issue || 'Other'}`,
    };
  }
}

// ——— 2. CategoryAgent ———
export class CategoryAgent extends BaseAgent {
  name = 'CategoryAgent';

  async run(ctx: AgentContext) {
    const reportOut = ctx.results['ReportAgent']?.output;
    const detected = reportOut?.issue as string;
    const confidence = typeof reportOut?.confidence === 'number' ? reportOut.confidence : 0.85;
    const validCategories: IssueCategory[] = [
      'Pothole', 'Garbage', 'Water Leak', 'Broken Streetlight',
      'Drainage Issue', 'Graffiti', 'Broken Sidewalk', 'Fallen Tree',
      'Public Safety Hazard', 'Traffic Signal Failure', 'Other',
    ];
    const category = validCategories.includes(detected as IssueCategory) ? (detected as IssueCategory) : 'Other';

    return {
      data: { category },
      confidence,
      reasoning: `Category classified as ${category} based on ReportAgent analysis`,
    };
  }
}

// ——— 3. SeverityAgent ———
export class SeverityAgent extends BaseAgent {
  name = 'SeverityAgent';

  async run(ctx: AgentContext) {
    const reportOut = ctx.results['ReportAgent']?.output;
    const detected = reportOut?.severity as string;
    const confidence = typeof reportOut?.confidence === 'number' ? reportOut.confidence : 0.88;
    const validSeverities: SeverityLevel[] = ['Low', 'Medium', 'High', 'Critical'];
    const severity = validSeverities.includes(detected as SeverityLevel) ? (detected as SeverityLevel) : 'Medium';

    // Boost severity for keywords
    const desc = (ctx.input.description || ctx.input.voiceText || '').toLowerCase();
    let finalSeverity = severity;
    if (desc.includes('danger') || desc.includes('accident') || desc.includes('hazard') || desc.includes('burst') || desc.includes('blocking')) {
      finalSeverity = 'Critical';
    } else if (desc.includes('broken') || desc.includes('not working') || desc.includes('leak')) {
      if (severity === 'Low') finalSeverity = 'Medium';
    }

    return {
      data: { severity: finalSeverity },
      confidence,
      reasoning: `Severity assessed as ${finalSeverity} based on content and keywords`,
    };
  }
}

// ——— 4. RouteAgent ———
export class RouteAgent extends BaseAgent {
  name = 'RouteAgent';

  async run(ctx: AgentContext) {
    const category = ctx.results['CategoryAgent']?.output?.category as IssueCategory;
    const department = CATEGORY_DEPT[category] || 'Public Works';

    return {
      data: { department, routed: true },
      confidence: 0.95,
      reasoning: `Routed to ${department} based on category ${category}`,
    };
  }
}

// ——— 5. TrustAgent ———
export class TrustAgent extends BaseAgent {
  name = 'TrustAgent';

  async run(ctx: AgentContext) {
    // Simple heuristic: longer description + image = higher trust
    let score = 70;
    const desc = ctx.input.description || ctx.input.voiceText || '';
    if (desc.length > 50) score += 10;
    if (desc.length > 100) score += 10;
    if (ctx.input.image) score += 10;
    if (ctx.input.location) score += 5;
    score = Math.min(99, score);

    return {
      data: { trustScore: score },
      confidence: 0.8,
      reasoning: `Trust score ${score} based on input completeness and media presence`,
    };
  }
}

// ——— 6. FraudAgent ———
export class FraudAgent extends BaseAgent {
  name = 'FraudAgent';

  async run(ctx: AgentContext) {
    // Simple heuristic: check for duplicate-like descriptions or suspicious patterns
    let fraudScore = 5;
    const desc = (ctx.input.description || ctx.input.voiceText || '').toLowerCase();
    if (desc.length < 10) fraudScore += 15;
    if (!ctx.input.image && !ctx.input.location) fraudScore += 20;
    if (desc.includes('test') || desc.includes('fake')) fraudScore += 30;
    fraudScore = Math.min(100, fraudScore);

    return {
      data: { fraudScore, flagged: fraudScore > 40 },
      confidence: 0.75,
      reasoning: `Fraud risk ${fraudScore}/100 based on input patterns`,
    };
  }
}

// ——— 7. EscalationAgent ———
export class EscalationAgent extends BaseAgent {
  name = 'EscalationAgent';

  async run(ctx: AgentContext) {
    const severity = ctx.results['SeverityAgent']?.output?.severity as SeverityLevel;
    const fraud = ctx.results['FraudAgent']?.output?.flagged as boolean;
    let level = 0;
    if (severity === 'Critical') level = 2;
    if (severity === 'High') level = 1;
    if (fraud) level = 0; // Fraud overrides escalation

    return {
      data: { escalationLevel: level, escalated: level > 0 },
      confidence: 0.9,
      reasoning: `Escalation level ${level} based on severity ${severity} and fraud check`,
    };
  }
}

// ——— 8. VerificationAgent ———
export class VerificationAgent extends BaseAgent {
  name = 'VerificationAgent';

  async run(ctx: AgentContext) {
    const beforeImage = ctx.input.image as string;
    const afterImageResult = ctx.results['afterImage'];
    const afterImage = (afterImageResult?.output?.image as string) || beforeImage;

    if (beforeImage && afterImage) {
      const result = await compareImages(beforeImage, afterImage);
      return {
        data: {
          status: result.status,
          confidence: result.confidence,
          explanation: result.explanation,
        },
        confidence: result.confidence,
        reasoning: result.explanation,
      };
    }

    return {
      data: { status: 'Not Fixed', confidence: 0.5, explanation: 'Insufficient images for comparison' },
      confidence: 0.5,
      reasoning: 'Missing before/after images',
    };
  }
}

// ——— 9. PredictionAgent ———
export class PredictionAgent extends BaseAgent {
  name = 'PredictionAgent';

  async run(ctx: AgentContext) {
    // Return mock predictions based on location
    const loc = ctx.input.location;
    const predictions: Prediction[] = [
      {
        id: `pred-${Date.now()}`,
        lat: (loc?.lat ?? 19.076) + 0.001,
        lng: (loc?.lng ?? 72.8777) + 0.001,
        riskScore: 78,
        category: 'Pothole',
        confidence: 72,
        reason: 'Historical pattern + weather conditions',
        timeframe: 'Next 7 days',
      },
    ];

    return {
      data: { predictions },
      confidence: 0.72,
      reasoning: 'Generated prediction based on historical patterns and location context',
    };
  }
}

// ——— 10. AnalyticsAgent ———
export class AnalyticsAgent extends BaseAgent {
  name = 'AnalyticsAgent';

  async run(ctx: AgentContext) {
    const allResults = Object.values(ctx.results);
    const avgConfidence = allResults.reduce((s, r) => s + (r.confidence || 0), 0) / (allResults.length || 1);

    return {
      data: {
        agentsProcessed: allResults.length,
        averageConfidence: Number(avgConfidence.toFixed(2)),
        pipelineDuration: Date.now(),
      },
      confidence: avgConfidence,
      reasoning: `Analytics computed over ${allResults.length} agent results`,
    };
  }
}

// ——— Singleton instances ———
export const reportAgent = new ReportAgent();
export const categoryAgent = new CategoryAgent();
export const severityAgent = new SeverityAgent();
export const routeAgent = new RouteAgent();
export const trustAgent = new TrustAgent();
export const fraudAgent = new FraudAgent();
export const escalationAgent = new EscalationAgent();
export const verificationAgent = new VerificationAgent();
export const predictionAgent = new PredictionAgent();
export const analyticsAgent = new AnalyticsAgent();

// ——— Pipeline ———
export async function runAgentPipeline(input: ReportInput): Promise<{ results: Record<string, AgentResult>; summary: Partial<Issue> }> {
  const ctx: AgentContext = { input, results: {} };

  // Phase 1: Core analysis
  const reportRes = await reportAgent.process(ctx);
  ctx.results[reportAgent.name] = reportRes;

  const categoryRes = await categoryAgent.process(ctx);
  ctx.results[categoryAgent.name] = categoryRes;

  const severityRes = await severityAgent.process(ctx);
  ctx.results[severityAgent.name] = severityRes;

  // Phase 2: Routing & Trust
  const routeRes = await routeAgent.process(ctx);
  ctx.results[routeAgent.name] = routeRes;

  const trustRes = await trustAgent.process(ctx);
  ctx.results[trustAgent.name] = trustRes;

  const fraudRes = await fraudAgent.process(ctx);
  ctx.results[fraudAgent.name] = fraudRes;

  // Phase 3: Escalation
  const escalationRes = await escalationAgent.process(ctx);
  ctx.results[escalationAgent.name] = escalationRes;

  // Phase 4: Analytics
  const analyticsRes = await analyticsAgent.process(ctx);
  ctx.results[analyticsAgent.name] = analyticsRes;

  const summary: Partial<Issue> = {
    category: categoryRes.output.category as IssueCategory,
    severity: severityRes.output.severity as SeverityLevel,
    department: routeRes.output.department as string,
    trustScore: trustRes.output.trustScore as number,
    fraudScore: fraudRes.output.fraudScore as number,
    escalationLevel: escalationRes.output.escalationLevel as number,
    status: fraudRes.output.flagged ? 'AI_Processing' : 'Validated',
    aiSummary: reportRes.output.description as string,
    aiConfidence: reportRes.confidence * 100,
  };

  return { results: ctx.results, summary };
}

// Quick analysis for /api/agents/analyze
export async function runQuickAnalysis(input: { image?: string; text?: string }): Promise<{ report: AgentResult; category: AgentResult }> {
  const mockInput: ReportInput = {
    userId: 'quick-analyze',
    description: input.text,
    image: input.image,
  };
  const ctx: AgentContext = { input: mockInput, results: {} };

  const report = await reportAgent.process(ctx);
  ctx.results[reportAgent.name] = report;

  const category = await categoryAgent.process(ctx);
  ctx.results[categoryAgent.name] = category;

  return { report, category };
}
