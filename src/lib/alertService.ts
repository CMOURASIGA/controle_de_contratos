
import { PrismaClient, Contract, Expense } from '@prisma/client';
import { transporter, isEmailConfigured, mailOptions } from './nodemailer';

const prisma = new PrismaClient();

const NOTIFICATION_THRESHOLD_PERCENT = 80;
const EXPIRATION_DAYS_THRESHOLD = 30;

// Define a type for contract with expenses included
type ContractWithExpenses = Contract & { expenses: Expense[] };

// Helper to format currency
const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Finds contracts nearing expiration or exceeding budget and sends email alerts.
 */
export async function checkContractsAndSendAlerts() {
  if (!isEmailConfigured()) {
    return {
      success: false,
      message: "Email service is not configured. Skipping alerts.",
      alertsSent: 0,
    };
  }

  console.log("Starting contract check for alerts...");

  try {
    // 1. Find contracts nearing expiration
    const expirationDateThreshold = new Date();
    expirationDateThreshold.setDate(expirationDateThreshold.getDate() + EXPIRATION_DAYS_THRESHOLD);

    const expiringContracts = await prisma.contract.findMany({
      where: {
        endDate: {
          lte: expirationDateThreshold, // Less than or equal to 30 days from now
          gte: new Date(), // And not already expired
        },
      },
    });

    // 2. Find contracts exceeding budget
    const allContracts: ContractWithExpenses[] = await prisma.contract.findMany({
      include: {
        expenses: true,
      },
    });

    const budgetExceedingContracts = allContracts.filter(contract => {
      const totalSpent = contract.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const spendingPercentage = (totalSpent / contract.totalValue) * 100;
      return spendingPercentage >= NOTIFICATION_THRESHOLD_PERCENT;
    });

    // 3. Send alerts (ensuring no duplicate emails for the same contract)
    const contractsToAlert = new Map<number, { contract: ContractWithExpenses; reasons: string[] }>();

    expiringContracts.forEach(c => {
        if (!contractsToAlert.has(c.id)) {
            // Since expiringContracts doesn't have expenses, we need to find it in allContracts
            const fullContract = allContracts.find(ac => ac.id === c.id);
            if (fullContract) {
              contractsToAlert.set(c.id, { contract: fullContract, reasons: [] });
            }
        }
        contractsToAlert.get(c.id)?.reasons.push(`O contrato está prestes a vencer em ${new Date(c.endDate).toLocaleDateString('pt-BR')}.`);
    });

    budgetExceedingContracts.forEach(c => {
        if (!contractsToAlert.has(c.id)) {
            contractsToAlert.set(c.id, { contract: c, reasons: [] });
        }
        const totalSpent = c.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        contractsToAlert.get(c.id)?.reasons.push(`O saldo utilizado (${formatCurrency(totalSpent)}) ultrapassou ${NOTIFICATION_THRESHOLD_PERCENT}% do valor total do contrato (${formatCurrency(c.totalValue)}).`);
    });

    if (contractsToAlert.size === 0) {
        console.log("No contracts require alerts today.");
        return { success: true, message: "No alerts to send.", alertsSent: 0 };
    }

    let alertsSentCount = 0;
    for (const { contract, reasons } of contractsToAlert.values()) {
      // Create a single alert message by joining reasons
      const alertMessage = reasons.join(' ');

      // Save to database
      await prisma.alert.create({
        data: {
          contractId: contract.id,
          message: alertMessage,
          read: false,
        },
      });

      const mailContent = `
        <p>Olá,</p>
        <p>Este é um alerta sobre o contrato "<strong>${contract.name}</strong>":</p>
        <ul>
          ${reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <p>Por favor, revise o contrato para tomar as ações necessárias.</p>
        <p>Obrigado,<br/>Sistema de Controle de Contratos</p>
      `;

      await transporter.sendMail({
        ...mailOptions,
        to: contract.focalPointEmail,
        subject: `Alerta: Contrato ${contract.name}`,
        html: mailContent,
      });
      console.log(`Alert sent for contract #${contract.id} to ${contract.focalPointEmail}`);
      alertsSentCount++;
    }

    return {
      success: true,
      message: `Successfully sent ${alertsSentCount} alerts.`,
      alertsSent: alertsSentCount,
    };

  } catch (error) {
    console.error("Failed to send contract alerts:", error);
    return {
      success: false,
      message: "An error occurred while sending alerts.",
      alertsSent: 0,
    };
  }
}
