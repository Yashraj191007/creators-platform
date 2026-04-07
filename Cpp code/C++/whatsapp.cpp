#include <iostream>
#include <cstdlib>
#include <thread>
#include <chrono>
using namespace std;

int main() {
    // Give user time to focus the chat window (e.g., WhatsApp Desktop)
    this_thread::sleep_for(chrono::seconds(5)); // 5 seconds

    const int repeat = 5; // number of times to send the message   ******  
    const int delay_ms = 500; // delay between messages

    for (int i = 0; i < repeat; ++i) {
        // Copy "hello" to clipboard using cmd's clip utility
        // echo sends text to clip which places it into the Windows clipboard
        system("cmd /c \"echo Jai Shree Ram.|clip\"");  //type your message here   ******

        // Use PowerShell to simulate Ctrl+V then Enter (requires the target window to be focused)
        // We add the Windows Forms assembly and use SendKeys::SendWait
        system(
            "powershell -command \"Add-Type -AssemblyName System.Windows.Forms; "
            "[System.Windows.Forms.SendKeys]::SendWait('^v'); "
            "[System.Windows.Forms.SendKeys]::SendWait('{ENTER}')\""
        );

        this_thread::sleep_for(chrono::milliseconds(delay_ms));
    }

    return 0;
}
