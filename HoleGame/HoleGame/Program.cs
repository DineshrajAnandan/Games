using System;
using System.Linq;

namespace HoleGame
{
    class Program
    {
        private static int[] player1Arr = new int[7];
        private static int[] player2Arr = new int[7];
        private static int player1Beads = 0;
        private static int player2Beads = 0;
        private static int noOfBeads;
        private static int holePicked;
        private static bool player1Turn = false;
        private static string holeNaming = "abcdefg";
        static void Main(string[] args)
        {
            ShowGameTitle();
            ShowPlayersScores();
            GetInputNoOfBeadsPerHole();
            Array.Fill(player1Arr, noOfBeads);
            Array.Fill(player2Arr, noOfBeads);
            DisplayHoleStatus();

            while (true)
            {
                Console.Clear();
                PlayLoop();
                if (CheckIfAnyArrayIsEmpty())
                { 
                    EndGame();
                    break;
                }
            }

        }

        private static void EndGame()
        {
            Console.Clear();
            ShowGameTitle();
            ShowPlayersScores();
            if (player1Beads == player2Beads)
            { Console.WriteLine("Match Draw!"); return; }
            Console.WriteLine($"{(player1Beads > player2Beads ? "Player 1" : "Player 2")} Won");
        }

        private static bool CheckIfAnyArrayIsEmpty() 
        {
            bool player1ArrayIsEmpty = !player1Arr.Any(x => x != 0);
            bool player2ArrayIsEmpty = !player2Arr.Any(x => x != 0);
            return player1ArrayIsEmpty || player2ArrayIsEmpty;
        }

        private static void PlayLoop() 
        {
            ShowGameTitle();
            ShowPlayersScores();
            DisplayHoleStatus();
            player1Turn = !player1Turn;
            holePicked = GetUserSelection();
            var result = PlayAction(player1Turn, player1Arr, player2Arr, holePicked);
            player1Arr = result.Player1Array;
            player2Arr = result.Player2Array;
            if (player1Turn) player1Beads += result.BeadsWon;
            else player2Beads += result.BeadsWon;
            
        }

        private static void ShowPlayersScores()
        {
            var defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"Player 1 :: {player1Beads}                     player 2 :: {player2Beads}", Console.ForegroundColor);
            Console.ForegroundColor = defaultColor;
        }

        private static void GetInputNoOfBeadsPerHole()
        {
            int input;
            Console.Write("\nEnter No of Beads you would like to play with (3 to 15) : ");
            bool success = int.TryParse(Console.ReadLine(), out input);
            if (!success || input < 3 || input > 15)
            {
                LogError("Please enter a valid input.");
                GetInputNoOfBeadsPerHole();
            }
            else
                noOfBeads = input;
        }

        private static PlayActionResult PlayAction(bool player1Turn, int[] player1Arr, int[] player2Arr, int holePicked)
        {
            int[] playArr;
            int currTakeIndex = holePicked + 1;
            int beadsTook = player1Turn ? player1Arr[holePicked] : player2Arr[holePicked];
            if (player1Turn)
            {
                player1Arr[holePicked] = 0;
                playArr = player1Arr.Concat(player2Arr).ToArray();
            }
            else
            {
                player2Arr[holePicked] = 0;
                playArr = player2Arr.Concat(player1Arr).ToArray();
            }
        distribute:
            for (int i = 0; i < beadsTook; i++)
            {
                int indexToUpdate = currTakeIndex + i;
                indexToUpdate = (indexToUpdate > playArr.Length - 1) ? indexToUpdate - playArr.Length : indexToUpdate;
                playArr[indexToUpdate] = playArr[indexToUpdate] + 1;
                if (i == beadsTook - 1) currTakeIndex = (indexToUpdate + 1 > playArr.Length - 1) ? 0 : indexToUpdate + 1;
            }
            if (playArr[currTakeIndex] != 0)
            {
                beadsTook = playArr[currTakeIndex];
                playArr[currTakeIndex] = 0;
                currTakeIndex = currTakeIndex + 1 > playArr.Length -1 ? 0 : currTakeIndex + 1;
                goto distribute;
            }
            else
            {
                int beadsWon = playArr[currTakeIndex + 1 > playArr.Length - 1 ? 0 : currTakeIndex + 1];
                playArr[currTakeIndex + 1 > playArr.Length - 1 ? 0 : currTakeIndex + 1] = 0;
                int[] player1ArrResult = new int[player1Arr.Length];
                int[] player2ArrResult = new int[player2Arr.Length];
                if (player1Turn)
                {
                    Array.Copy(playArr, 0, player1ArrResult, 0, player1Arr.Length);
                    Array.Copy(playArr, player1Arr.Length, player2ArrResult, 0, player2Arr.Length);
                }
                else
                {
                    Array.Copy(playArr, 0, player2ArrResult, 0, player2Arr.Length);
                    Array.Copy(playArr, player2Arr.Length, player1ArrResult, 0, player1Arr.Length);
                }
                return new PlayActionResult
                {
                    Player1Array = player1ArrResult,
                    Player2Array = player2ArrResult,
                    BeadsWon = beadsWon
                };
            }
        }

        private static int GetUserSelection()
        {
            Console.WriteLine("######################################################");
            Console.Write($"Player {(player1Turn ? 1 : 2)}'s turn :: Please select the hole to pick ({string.Join(", ", holeNaming.ToCharArray())}) :: ");
            var pickArr = player1Turn ? player1Arr : player2Arr;
            int holePicked;
            try
            {
                var userInput = Console.ReadLine();
                holePicked = holeNaming.IndexOf(userInput);
                if (userInput.Length > 1 || holePicked == -1) throw new Exception();
                if (pickArr[holePicked] == 0)
                {
                    LogError("The picked hold has no beads. Please pick other hole");
                    return GetUserSelection();
                }                    
            }
            catch (Exception)
            {
                Console.WriteLine("######################################################");
                LogError($"Please enter a valid input. It could be {string.Join(", ", holeNaming.ToCharArray())}.");
                return GetUserSelection();
            }

            return holePicked;
        }

        private static void DisplayHoleStatus()
        {
            Console.WriteLine(" _________________________________________________________player 1\n");
            for (int i = 0; i < 7; i++)
                Console.Write($" [{player1Arr[i],3}]{holeNaming[i]} ");
            Console.WriteLine("\n _________________________________________________________\n");
            for (int i = 0; i < 7; i++)
                Console.Write($" [{player2Arr[i],3}]{holeNaming[i]} ");
            Console.WriteLine("\n _________________________________________________________player 2\n");
        }

        private static void ShowGameTitle()
        {
            var defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("***************************************************************");
            Console.WriteLine("                          HOLE GAME");
            Console.WriteLine("***************************************************************");
            Console.ForegroundColor = defaultColor;
        }

        private static void LogError(string msg)
        {
            var defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(msg, Console.ForegroundColor);
            Console.ForegroundColor = defaultColor;
        }
    }

    public class PlayActionResult
    {
        public int[] Player1Array { get; set; }
        public int[] Player2Array { get; set; }
        public int BeadsWon { get; set; }
    }
}
