export const runtime = 'nodejs';
// src/app/api/pedidos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import type { Responsavel, TokenOpcao } from '@prisma/client';

function normalizeResponsavel(input: any): Responsavel {
  if (input === 'FRANK GIOVANNI LOPES') return 'FRANK_GIOVANNI_LOPES';
  if (input === 'MATHEUS CARDOSO SOARES') return 'MATHEUS_CARDOSO_SOARES';
  if (input === 'FRANK_GIOVANNI_LOPES' || input === 'MATHEUS_CARDOSO_SOARES') return input;
  return 'FRANK_GIOVANNI_LOPES';
}

function normalizeToken(input: any): TokenOpcao | null {
  if (input == null || input === '') return null;
  if (input === 'com-token' || input === 'COM_TOKEN') return 'COM_TOKEN';
  if (input === 'sem-token' || input === 'SEM_TOKEN') return 'SEM_TOKEN';
  return null;
}

function unmapResponsavel(r: Responsavel) {
  return r === 'FRANK_GIOVANNI_LOPES' ? 'FRANK GIOVANNI LOPES' : 'MATHEUS CARDOSO SOARES';
}
function unmapToken(t: TokenOpcao | null) {
  if (!t) return null;
  return t === 'COM_TOKEN' ? 'com-token' : 'sem-token';
}

export async function GET() {
  try {
    const rows = await prisma.pedido.findMany({ orderBy: { createdAt: 'desc' } });
    const data = rows.map(p => ({
      ...p,
      valorTotal: Number(p.valorTotal),
      valorRecebido: Number(p.valorRecebido),
      tokenOpcao: unmapToken(p.tokenOpcao),
      responsavel: unmapResponsavel(p.responsavel),
    }));
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    console.error('GET /api/pedidos error:', e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.tipo || !body?.cpfCnpj) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const created = await prisma.pedido.create({
      data: {
        tipo: String(body.tipo),
        isA3: !!body.isA3,
        isCnpj: !!body.isCnpj,
        cpfCnpj: String(body.cpfCnpj),
        nomePessoa: body.nomePessoa ?? null,
        curador: body.curador ?? null,
        nomeEmpresa: body.nomeEmpresa ?? null,
        representanteLegal: body.representanteLegal ?? null,
        tokenOpcao: normalizeToken(body.tokenOpcao),
        valorTotal: Number(body.valorTotal ?? 0),
        valorRecebido: Number(body.valorRecebido ?? 0),
        responsavel: normalizeResponsavel(body.responsavel),
      },
    });

    return NextResponse.json({
      ...created,
      valorTotal: Number(created.valorTotal),
      valorRecebido: Number(created.valorRecebido),
      tokenOpcao: unmapToken(created.tokenOpcao),
      responsavel: unmapResponsavel(created.responsavel),
    });
  } catch (e: any) {
    console.error('POST /api/pedidos error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
