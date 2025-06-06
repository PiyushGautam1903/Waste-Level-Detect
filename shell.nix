let
  pkgs = import <nixpkgs> {};

  pythonEnv = pkgs.python310.withPackages (ps: with ps; [
    pyserial
    websockets  # <-- Add this!
  ]);

in
pkgs.mkShell {
  buildInputs = [
    pythonEnv
    pkgs.nodejs_20
    pkgs.git
  ];

  shellHook = ''
    unset __vsc_prompt_cmd_original
    echo "🐍 Python: $(python --version)"
    echo "🧰 Node: $(node --version)"
    echo "🔌 pyserial: $(python -c 'import serial; print(serial.__version__)')"
  '';
}
