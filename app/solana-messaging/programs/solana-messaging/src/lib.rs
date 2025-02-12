use anchor_lang::prelude::*;

declare_id!("YourProgramIDWillBeHere");

#[program]
pub mod solana_messaging {
    use super::*;

    #[account]
    pub struct Message {
        pub sender: Pubkey,    // Sender's Solana address
        pub recipient: Pubkey, // Recipient's Solana address
        pub content: String,   // Message content
    }

    pub fn send_message(ctx: Context<SendMessage>, content: String) -> ProgramResult {
        // Validate message length
        if content.len() > 500 {
            return Err(ProgramError::InvalidArgument);
        }

        // Validate sender and recipient addresses
        if ctx.accounts.sender.key == ctx.accounts.recipient.key {
            return Err(ProgramError::InvalidArgument);
        }

        let message = &mut ctx.accounts.message;
        message.sender = *ctx.accounts.sender.key;
        message.recipient = *ctx.accounts.recipient.key;
        message.content = content;
        Ok(())
    }

    pub fn get_messages(ctx: Context<GetMessages>) -> ProgramResult {
        let messages = &ctx.accounts.messages;
        // Retrieve messages for the recipient
        let recipient_messages: Vec<&Message> = messages
            .iter()
            .filter(|msg| msg.recipient == *ctx.accounts.recipient.key)
            .collect();
        // Return the filtered messages (placeholder)
        Ok(())
    }

    #[derive(Accounts)]
    pub struct SendMessage<'info> {
        #[account(init, payer = sender, space = 8 + 32 + 32 + 500)]
        pub message: Account<'info, Message>,
        #[account(mut)]
        pub sender: Signer<'info>,
        pub recipient: AccountInfo<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct GetMessages<'info> {
        #[account()]
        pub recipient: AccountInfo<'info>,
        pub messages: Account<'info, Vec<Message>>,
    }
}